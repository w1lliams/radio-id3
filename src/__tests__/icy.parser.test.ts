import * as nock from 'nock';
import { icyParser } from '../parsers/icy.parser';

beforeAll(() => {
  const rawMetadata = Buffer.from("StreamTitle='artist1 - song23';");
  const metadataSize = Buffer.alloc(1);
  metadataSize.writeUIntBE(2, 0, 1);
  const response = Buffer.alloc(2000);
  Buffer.concat([metadataSize, rawMetadata]).copy(response, 399);

  nock('http://stream-test.com')
    .get('/hit100')
    .reply(200, response, { 'icy-metaint': '399', 'icy-br': '64' });
});

test('ShoutcastV1 parser', () => {
  return icyParser('http://stream-test.com/hit100').then(metadata =>
    expect(metadata).toEqual({
      title: 'artist1 - song23',
      type: 'ICY',
      bitrate: 64,
    }),
  );
});
