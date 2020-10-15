const users = [];

//join user to chat (no db only current state)
export function userJoin(id, username, room){
  const user = {id, username, room};
  users.push(user);
  return user;
}


//get currentUser from the state
export function getCurrentUser(id){
  return users.find(user => user.id === id);
}


//delete user from the state
export function userLeave(id){
  const index = users.find(user => user.id === id);
  if(index !== -1){
    return users.splice(index, 1)[0];
  }
}


//get user room
export function getRoomUsers(room){
  return users.filter(user => user.room === room);
}
