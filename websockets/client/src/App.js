// Nicholas Szegheo and Yakov Kazinets
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);
  const [current_room, setRoom] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('/');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on('message', ({ name, message, room }) => {
      setChat([...chat, { name, message, room }]);
    });
    socketRef.current.on('user_join', function (data) {
      setChat([
        ...chat,
        { name: 'ChatBot', message: `${data.name} has joined the chat ${data.room}` }
      ]);
    });
    socketRef.current.on('user_leave', function (data) {
      setChat([
        ...chat,
        { name: 'ChatBot', message: `${data.name} has left the chat ${data.room}` }
      ]);
    });
  }, [chat]);

  const userjoin = (name, room) => {
    socketRef.current.emit('user_join', {name: name, room: room});
    setRoom(room);
  };

  const changeRoom = (e) =>{
    e.preventDefault();

    let room = document.getElementById('room_select').value;
    if (current_room !== room){
      console.log(`Changing room from ${current_room} to ${room}`);
      setRoom(room);
      socketRef.current.emit('change_room', {name: state.name, old_room: current_room, new_room: room});
    }
    
  }

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById('message');
    console.log([msgEle.name], msgEle.value);
    setState({ ...state, [msgEle.name]: msgEle.value });
    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value,
      room: current_room
    });
    e.preventDefault();
    setState({ message: '', name: state.name });
    msgEle.value = '';
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({ name, message, room }, index) => (
      <div key={index}>
        <h3>
          {name}({room}): <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      {state.name && (
        <div className="card">
          <div className="render-chat">
            <h1>Chat Log: {current_room}</h1>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name="message"
                id="message"
                variant="outlined"
                label="Message"
              />
            </div>
            <button>Send Message</button>
          </form>


          <form onSubmit={changeRoom}>
            <label>Choose a room:
              <br />
              <select name="rooms" id="room_select">
                <option value="room1">Room 1</option>
                <option value="room2">Room 2</option>
                <option value="room3">Room 3</option>
              </select>
              <button>Change Room</button>
            </label>

          </form>
        </div>
      )}

      {!state.name && (
        <form
          className="form"
          onSubmit={(e) => {
            console.log(document.getElementById('username_input').value);
            e.preventDefault();
            setState({ name: document.getElementById('username_input').value });
            //userjoin(document.getElementById('username_input').value, "room2");
            userjoin(document.getElementById('username_input').value, document.getElementById('room_select').value);
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input id="username_input" />
            </label>
          </div>
          <br />
          <label>Choose a room:
            <br />
            <select name="rooms" id="room_select">
              <option value="room1">Room 1</option>
              <option value="room2">Room 2</option>
              <option value="room3">Room 3</option>
            </select>
          </label>
          <br />
          <br />
          <button type="submit"> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default App;