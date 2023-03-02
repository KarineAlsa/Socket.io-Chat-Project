const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
const port = 3000;





app.set('port', process.env.PORT || port);

require('./sockets')(io);

// Static files
app.use(express.static(path.join(__dirname,'public')));

// Create a server 
server.listen(app.get('port'), ()=>{
    console.log('listening on port '+ app.get('port'));
});

