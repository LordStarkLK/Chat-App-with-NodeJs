const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get usern name
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true
});
const socket = io();

//join chat room
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers',({room,users}) => {
  outputRoomName(room);
  outputUsers(users);
})

//message from server
socket.on('message',message => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //emting the message
  socket.emit('chatMessage',msg);

  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

})


//output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}

//users list to DOM
function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

//leave button
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});