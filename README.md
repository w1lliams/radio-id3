# Radio ID3

A simple library to get metadata and song title from icecast/shoutcast streams.

### Getting started

Install icecast-parser from npm:
``` bash
npm install radio-id3 --save
```

Get metadata from online radio stream:
``` javascript
const { parseRadioID3 } = require('radio-id3');

parseRadioID3('http://centova1.cheapshoutcast.com:8174/;stream.mp3')
  .then(console.log)
  .catch(console.error); 
```

or
``` javascript
const { parseRadioID3 } = require('radio-id3');

try {
  const metadata = await parseRadioID3('http://centova1.cheapshoutcast.com:8174/;stream.mp3');
  console.log(metadata);
} catch (error) {
  console.error(error);
} 
```
