const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 7000 });

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var ntpClient = require('ntp-client');
ntpClient.getNetworkTime("pool.ntp.org", 123, function(err, date) {
    if(err) {
        console.error(err);
        return;
    }
 
    console.log("Current time : ");
    console.log(date+ " Date in comp: "+new Date().toString()); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été))
});

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  wss.clients.forEach(function each(client) {
    if(client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
});

server.on('listening', () => {
  const address = server.address();
  server.send('hello', 9000, '127.0.0.1');
});

server.bind(7100);

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if(client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    server.send(message, 9000, '127.0.0.1');
  });
});
