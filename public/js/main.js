const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');
const socket = io();


 // Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});


//join chat room
socket.emit('joinRoom', {username, room});


//get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});


//message from server
socket.on('message1', message => {
  console.log(message);
  outputMessage(message);

  //scroll down to new messages automatically
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


//message submit
chatForm.addEventListener('submit', (event) => {
  //the event submit form to file in default state but we want it here
  event.preventDefault();
  //target = chatForm, elements = element inside form and msg = id of text field
  let msg = event.target.elements.msg.value;
  //send message to server
  socket.emit('chatMessage', msg);

  //clear send message from the form's text field
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});


//out put message to DOM
function outputMessage(message){

  //create a new element
  const el = document.createElement('div');
  //add class name
  el.classList.add('message');
  el.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p><p class="text">${message.text}</p>`;

  //add this to already defined div element called chat-messages
  document.querySelector('.chat-messages').appendChild(el);
}


//add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}


//add user list to DOM
function outputUsers(users){
  usersList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
