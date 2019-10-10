import { Socket } from 'net';
import * as assert from 'assert';

const HttpHead = Buffer.from('HTTP/1.0');

function makeChunk(chunk: Buffer): Buffer {
  assert(chunk.length >= 3, 'buffer too small! ' + chunk.length);
  if (/icy/i.test(chunk.slice(0, 3).toString())) {
    const b = Buffer.alloc(chunk.length + HttpHead.length - 'icy'.length);
    let i = HttpHead.copy(b);
    i += chunk.copy(b, i, 3);
    assert.strictEqual(i, b.length);
    chunk = b;
  }

  return chunk;
}

export function fixIcySocket(socket: Socket) {
  const originListeners = socket.listeners('data');
  socket.removeAllListeners('data');
  socket.on('data', (data: Buffer) => {
    const chunk = makeChunk(data);

    socket.removeAllListeners('data');
    originListeners.forEach(listener => socket.on('data', listener as any));
    socket.emit('data', chunk);
  });
}
