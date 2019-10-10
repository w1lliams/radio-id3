import * as got from 'got';
import { Writable } from 'stream';
import { ClientRequest, IncomingMessage } from 'http';
import { Metadata } from '../types/metadata';
import { fixIcySocket } from '../utils/fix-icy-socket';

class IcyReadStream extends Writable {
  private byteRead: number = 0;
  private metadataSize: number = 0;
  private metadata: Buffer | null = null;

  constructor(private readonly icyMetaint: number, opts?: any) {
    super(opts);
  }

  public _write(chunk: Buffer, encoding: string, callback: (error?: Error | null) => void) {
    if (this.metadata) {
      this.metadata = Buffer.concat([this.metadata, chunk.slice(0, this.metadata.length - this.metadataSize)]);
    } else if (this.byteRead + chunk.length > this.icyMetaint) {
      const start = this.icyMetaint - this.byteRead;
      this.metadataSize = chunk.readUIntBE(start, 1) * 16;
      this.metadata = chunk.slice(start + 1, start + 1 + this.metadataSize);
    }

    if (this.metadata && this.metadata.length >= this.metadataSize) {
      this.emit('metadata', this.getMetadataObject());
      this.destroy();
    }

    this.byteRead += chunk.length;
    callback();
  }

  private getMetadataObject(): object {
    if (this.metadata) {
      const metadata = this.metadata.toString();
      return metadata.split(';').reduce(
        (acc, val) => {
          const row = val.split('=');
          if (row.length === 2) {
            const key = row[0].trim();
            const value = row[1].trim().replace(/^['"](.*)['"]$/, '$1');
            acc[key.toLowerCase() === 'streamtitle' ? 'title' : key] = value;
          }
          return acc;
        },
        {} as any,
      );
    }
    return {};
  }
}

export async function icyParser(url: string): Promise<Metadata> {
  return new Promise<Metadata>((resolve, reject) => {
    const stream = got
      .stream(url, {
        timeout: 6000,
        headers: {
          'User-Agent': 'nodejs-radio-id3',
          'Icy-Metadata': '1',
        },
      })
      .once('request', (req: ClientRequest) => req.once('socket', fixIcySocket))
      .once('response', (res: IncomingMessage) => {
        const icyMetaint = Number(res.headers['icy-metaint']);
        const bitrate = Number(res.headers['icy-br']);
        if (icyMetaint > 0) {
          const icyStream = new IcyReadStream(icyMetaint);
          res.pipe(icyStream).on('metadata', ({ title }) => {
            resolve({ bitrate: bitrate || undefined, title, type: 'ICY' });
            stream.end(() => stream.destroy());
          });
        } else {
          stream.end(() => stream.destroy());
          reject(new Error('Can not find "icy-metaint" header'));
        }
      })
      .once('error', reject)
      .resume();
  });
}
