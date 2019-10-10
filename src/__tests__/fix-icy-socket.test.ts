import * as net from 'net';
import { fixIcySocket } from '../utils/fix-icy-socket';

let server: net.Server & { resp?: string };

beforeEach(done => {
  server = net.createServer(client => {
    client.write(server.resp || 'response');
    client.end();
  });
  server.listen(7432, done);
});

test('Fix live stream socket', done => {
  server.resp = `ICY 200 OK
    Content-Type: audio/aacp
    icy-br:128
    icy-pub:0
    Connection: Close
    icy-metaint:250

    body1
    body2
    body3`;

  const socket = net.connect(7432);
  socket.on('data', data => {
    expect(data.toString()).toBe(`HTTP/1.0 200 OK
    Content-Type: audio/aacp
    icy-br:128
    icy-pub:0
    Connection: Close
    icy-metaint:250

    body1
    body2
    body3`);
  });
  socket.on('end', done);
  socket.on('error', done);
  fixIcySocket(socket);
});
