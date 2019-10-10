import { parse } from 'url';
import * as got from 'got';
import { Metadata } from '../types/metadata';

export async function icecastParser(url: string): Promise<Metadata> {
  const parsedUrl = parse(url);
  const icecastStatusUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${
    parsedUrl.port && parsedUrl.port !== '80' ? `:${parsedUrl.port}` : ''
  }/status-json.xsl`;

  let { body } = await got(icecastStatusUrl, { timeout: 3000 });
  body = body.replace(/("quality":\s*\d+\.)(\D)/g, '$10$2'); // fix invalid json
  const data = JSON.parse(body);
  const source = data.icestats.source.find((item: any) => item.listenurl.endsWith(parsedUrl.pathname));
  if (!source) {
    throw new Error(`Can not find mount point ${parsedUrl.pathname} at ${icecastStatusUrl}`);
  }

  return {
    listeners: source.listeners,
    bitrate: source['ice-bitrate'] || source.bitrate,
    title: source.artist ? `${source.artist} - ${source.title}` : source.title,
    type: 'ICECAST',
  };
}
