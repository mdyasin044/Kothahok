
import React, { useContext } from "react"
import { SocketContext } from '../../Socket/Context';
import './Room.css'

const TaskBar = () => {
    const { exitRoom } = useContext(SocketContext);

    return (
      <div className="TaskBar">
        <button onClick={() => exitRoom()}>LEAVE</button>
      </div>
    );
}

export default TaskBar