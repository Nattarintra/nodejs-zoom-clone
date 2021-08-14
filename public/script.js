const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: '/peerjs', // from sever.js
  host: '/',
  port: '3030'
});
let myVideoStream 
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream =>{
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on('call', call => {
    // when B call me I answered the call
    call.answer(stream) // I'm gonna answer B call
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      // I'm gonna add video stream from B user 
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', (userId) =>{
    connectToNewUser(userId, stream);
  })

  
})

// Listen to peer connections
 peer.on('open', id =>{
 // console.log(id);

 // Join room ID from room.ejs file
socket.emit('join-room', ROOM_ID, id);

 });


const connectToNewUser = (userId, stream) =>{
  //console.log(userId);
  // Call another user that joined the room
  const call = peer.call(userId, stream) // call B user and I'm gonna send my stream.
  const video = document.createElement('video') // I'm gonna create new video element for B
  call.on('stream', userVideoStream => { // when I receive stream, then I will add video stream.
    addVideoStream(video, userVideoStream)
  })
  // call.on('close', () => {
  //   video.remove()
  // })

  //peers[userId] = call
}


const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata',() =>{
    video.play();
  })
 videoGrid.append(video);
}