import React, { useContext } from "react"
import { SocketContext } from "../../Socket/Context"
import { CiUser } from "react-icons/ci";
import './Room.css'

const Participant = ({ item }) => {
  return (
    <div className="Participant">
      <CiUser size={20} color='#8260df'/>
      <div style={{ marginLeft: '15px' }}>{item.userName}</div>
    </div>
  )
}

const ActiveList = () => {
    const { name, peers, roomID } = useContext(SocketContext);

    return (
      <div className="ActiveList">
        <div className="ParticipantCount">
          Participants ({peers.length+1})
        </div>
        <div className="ParticipantList">
          <div className="Participant">
            <CiUser size={20} color='#8260df'/>
            <div style={{ marginLeft: '15px' }}>{name}  (you)</div>
          </div>
          {peers.map((item, index) => {
              return (
                <Participant key={index} item={item} />
              )
          })}
        </div>
        <div className="RoomID">
          Room ID: {roomID}
        </div>
      </div>
    );
}

export default ActiveList