import React, { useContext, useState } from "react"
import { SocketContext } from "../../Socket/Context";
import { AiFillWechat } from "react-icons/ai";
import "./Home.css"

const Home = () => {
    const [error, setError] = useState('')
    const { setShowRoom, name, setName, roomID, setRoomID } = useContext(SocketContext);

    const joinRoom = () => {
      if(name.length < 4) {
        setError('Name should have atleast 4 letters')
      }
      else if(roomID === '') {
        setError('Room can not be empty')
      }
      else {
        setError('')
        setShowRoom(true)
      }
    }

    return (
      <div className="Home">
        <div className="LOGO"> 
          <AiFillWechat size={50} color='hsl(256, 72%, 77%)'/>
          <div style={{marginLeft: '10px'}}>KothaHok</div>
        </div>
        <div className="Box">
            Your Name
            <input value={name} onChange={(e) => setName(e.target.value)} className="InputField" placeholder="Enter your display name" />
            Room Name
            <input value={roomID} onChange={(e) => setRoomID(e.target.value)} className="InputField" placeholder="Enter room name"/>
            <div onClick={() => joinRoom()} className="JoinRoom">Join Room</div>
        </div>
        <div>
          {error}
        </div>
      </div>
    );
}

export default Home