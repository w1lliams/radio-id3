import * as nock from 'nock';
import { shoutcastV1Parser } from '../parsers/shoutcast-v1.parser';

beforeAll(() => {
  nock('http://shoutcast-v1-test.com')
    .get('/7.html')
    .reply(
      200,
      '<HTML><meta http-equiv="Pragma" content="no-cache"></head><body>100,1,4,25,0,64,artist - song</body></html>',
    );
});

test('ShoutcastV1 parser', () => {
  return shoutcastV1Parser('http://shoutcast-v1-test.com/;').then(metadata =>
    expect(metadata).toEqual({ listeners: 100, bitrate: 64, type: 'SHOUTCAST_V1', title: 'artist - song' }),
  );
});
