import React, { useContext, useState, useEffect } from "react"
import { SocketContext } from "../../Socket/Context";
import { AiFillWechat } from "react-icons/ai";
import "./Home.css"

const Home = () => {
  const [error, setError] = useState('')
  const { setShowRoom, name, setName, roomID, setRoomID } = useContext(SocketContext)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (name.length < 4 || name.length > 15 || roomID === '' || roomID.length > 15) {
      setIsError(true)
    }
    else {
      setIsError(false)
    }
  }, [name, roomID])

  const joinRoom = () => {
    if (name.length < 4) {
      setError('Name should have atleast 4 letters')
    }
    else if (name.length > 15) {
      setError('Name should not have more than 15 letters')
    }
    else if (roomID === '') {
      setError('Room can not be empty')
    }
    else if (roomID.length > 15) {
      setError('Room should not have more than 15 letters')
    }
    else {
      setError('')
      setShowRoom(true)
    }
  }

  return (
    <div className="Home">
      <div className="LOGO">
        <AiFillWechat size={50} color='hsl(256, 72%, 77%)' />
        <div style={{ marginLeft: '10px' }}>KothaHok</div>
      </div>
      <div className="Box">
        Your Name
        <input value={name} onChange={(e) => setName(e.target.value)} className="InputField" placeholder="Enter your display name - min 4 letters, max 15 letters" />
        Room Name
        <input value={roomID} onChange={(e) => setRoomID(e.target.value)} className="InputField" placeholder="Enter room name - max 15 letters" />
        <div className="ButtonBox">
          {isError ? (
            <>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="hover-point"></div>
              <div className="JoinRoom">Join Room</div>
            </>
          ) : (
            <div onClick={() => joinRoom()} className="JoinRoomStatic">Join Room</div>
          )}


        </div>
      </div>
      <div>
        {error}
      </div>
    </div>
  );
}

export default Home