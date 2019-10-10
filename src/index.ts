import { Metadata } from './types/metadata';
import { icyParser } from './parsers/icy.parser';
import { shoutcastV2Parser } from './parsers/shoutcast-v2.parser';

export async function parseRadioID3(url: string): Promise<Metadata> {
  return icyParser(url).catch(() => shoutcastV2Parser(url));
}

export { icyParser };
