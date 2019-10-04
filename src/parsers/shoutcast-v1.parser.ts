import * as csvToJson from 'csvtojson';
import * as got from 'got';
import { Metadata } from '../types/metadata';

export async function shoutcastV1Parser(url: string): Promise<Metadata> {
  const normalizedUrl = url.replace(/[;/]+$/g, '');
  const { body } = await got(`${normalizedUrl}/7.html`, {
    timeout: 3000,
    headers: {
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
    },
  });

  const csv = /<body[^>]*>(.*)<\/body>/.exec(body);
  if (!csv) {
    throw new Error('Can not find csv data at /7.html');
  }
  const data = await csvToJson({ noheader: true })
    .fromString(csv[1])
    .then(result => result[0])
    .then(Object.values);

  return {
    listeners: data[0] ? Number(data[0]) : undefined,
    bitrate: data[5] ? Number(data[5]) : undefined,
    title: data[6],
    type: 'SHOUTCAST_V1',
  };
}
