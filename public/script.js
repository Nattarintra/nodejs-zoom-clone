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


  let text = $('input');

$('html').keydown((e) =>{
  // 13 is === enter keyboard 
  if(e.which == 13 && text.val().length !== 0){

    // sending value of input from frontend
    //console.log(text.val());
    socket.emit('message', text.val());
    text.val(''); // clear text after entered
  }
})

socket.on('createMessage', message => {
  //console.log('This msg is from server', message);
  $('.messages').append(`<li class="message"><b>user</b><br />>${message}</li>`);
  scrollToBottom()
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

// Chat section scroll to bottom.
const scrollToBottom = () => {
  let d = $('.main__chat_window');
  d.scrollTop(d.prop('scrollHeight'));
}

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata',() =>{
    video.play();
  })
 videoGrid.append(video);
}

// Mute Video
const muteUnmute = () => {

  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {

    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {

    setMuteButton();
    // if is disable the enable video stream.
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
