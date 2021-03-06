const ws = require('websocket-stream');
const brokerConfig = require('../../config/broker');
const authorizePublish = require('./authorizePublish');
const authorizeSubscribe = require('./authorizeSubscribe');
const broker = require('./broker');
const onPublish = require('./onPublish');
const http = require('http');
const net = require('net');

broker.authorizeSubscribe = authorizeSubscribe;
broker.authorizePublish = authorizePublish;

broker.on('publish', onPublish);

const httpServer = http.createServer();

ws.createServer({
  server: httpServer,
}, broker.handle);

const server = net.createServer(broker.handle);

httpServer.listen(brokerConfig.wsPort, () => {
  console.log('Aedes server (WebSocket) running');
});

server.listen(brokerConfig.standalonePort, () => {
  console.log('Aedes server (Standalone) running');
});
