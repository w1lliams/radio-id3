import * as nock from 'nock';
import { shoutcastV2Parser } from '../parsers/shoutcast-v2.parser';

beforeAll(() => {
  nock('http://shoutcast-v2-test.com')
    .get('/stats')
    .reply(
      200,
      `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
      <SHOUTCASTSERVER>
      <CURRENTLISTENERS>43</CURRENTLISTENERS>
      <PEAKLISTENERS>4</PEAKLISTENERS>
      <MAXLISTENERS>25</MAXLISTENERS>
      <UNIQUELISTENERS>1</UNIQUELISTENERS>
      <AVERAGETIME>3204928</AVERAGETIME>
      <SERVERGENRE>Unspecified</SERVERGENRE>
      <SERVERGENRE2></SERVERGENRE2>
      <SERVERGENRE3></SERVERGENRE3>
      <SERVERGENRE4></SERVERGENRE4>
      <SERVERGENRE5></SERVERGENRE5>
      <SERVERURL>http://cheapshoutcast.com/centovacastv3-shoutcastv2-demo</SERVERURL>
      <SERVERTITLE></SERVERTITLE>
      <SONGTITLE>Freeplay Music - Preening Rookie</SONGTITLE>
      <STREAMHITS>1033</STREAMHITS>
      <STREAMSTATUS>1</STREAMSTATUS>
      <BACKUPSTATUS>0</BACKUPSTATUS>
      <STREAMLISTED>1</STREAMLISTED>
      <STREAMPATH>/stream</STREAMPATH>
      <STREAMUPTIME>20096831</STREAMUPTIME>
      <BITRATE>96</BITRATE>
      <SAMPLERATE>44100</SAMPLERATE>
      <CONTENT>audio/mpeg</CONTENT>
      <VERSION>2.6.0.750 (posix(linux x64))</VERSION>
      </SHOUTCASTSERVER>`,
    );
});

test('ShoutcastV1 parser', () => {
  return shoutcastV2Parser('http://shoutcast-v2-test.com/;').then(metadata =>
    expect(metadata).toEqual({
      listeners: 43,
      bitrate: 96,
      type: 'SHOUTCAST_V2',
      title: 'Freeplay Music - Preening Rookie',
    }),
  );
});
