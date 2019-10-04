import * as got from 'got';
import { get } from 'lodash';
import { parse } from 'fast-xml-parser';
import { Metadata } from '../types/metadata';
import { normalizeStreamUrl } from '../utils/normalize-stream-url';

export async function shoutcastV2Parser(url: string): Promise<Metadata> {
  const { body } = await got(`${normalizeStreamUrl(url)}/stats`);
  const data = parse(body);
  const bitrate = get(data, 'SHOUTCASTSERVER.BITRATE');
  const listeners = get(data, 'SHOUTCASTSERVER.CURRENTLISTENERS');

  return {
    title: get(data, 'SHOUTCASTSERVER.SONGTITLE'),
    listeners: listeners ? Number(listeners) : undefined,
    bitrate: bitrate ? Number(bitrate) : undefined,
    type: 'SHOUTCAST_V2',
  };
}
