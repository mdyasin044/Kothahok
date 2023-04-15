import React, { useContext } from "react"
import { SocketContext } from "../../Socket/Context";
import "./Home.css"

const Home = () => {
    const { setShowRoom, name, setName, roomID, setRoomID } = useContext(SocketContext);

    return (
      <div className="Home">
        <div className="Box">
          <div>
              Enter your name
              <input value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div>
              <button onClick={() => setShowRoom(true)}>Create Room</button>
              <input value={roomID} onChange={(e) => setRoomID(e.target.value)}/>
              <button onClick={() => setShowRoom(true)}>Join Room</button>
          </div>
        </div>
      </div>
    );
}

export default Home