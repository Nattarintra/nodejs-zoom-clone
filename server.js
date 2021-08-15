const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const {v4: uuidv4} = require('uuid');

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) =>{
  res.redirect(`/${uuidv4()}`); // uuid create a uniq room Id
})
// create a new url     
app.get('/:room', (req, res) =>{
  res.render('room',{roomId: req.params.room});
})

io.on('connection',socket => {
  // Gonna join that room
  socket.on('join-room', (roomId,userId)=>{
    //console.log('Joined room');
    socket.join(roomId); // now join the room
    socket.broadcast.to(roomId).emit('user-connected', userId); 
    // liesten for the message it will recieve msg from input
    socket.on('message', message => {
      // Send msg to roomId 
      io.to(roomId).emit('createMessage',message);
    })
    
   // socket.to(roomId).emit('user-connected'); // alternative 
    
  })
})
server.listen(3030);