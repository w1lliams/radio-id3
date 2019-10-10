import { normalizeStreamUrl } from '../utils/normalize-stream-url';

test('Normalize stream url', () => {
  expect(normalizeStreamUrl('https://livestream.com:8080/;')).toBe('https://livestream.com:8080');

  expect(normalizeStreamUrl('https://liveradio.com/mountpoint64//')).toBe('https://liveradio.com/mountpoint64');
});
