
import React, { useContext } from "react"
import { SocketContext } from '../../Socket/Context';
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiFillWechat } from "react-icons/ai";
import './Room.css'

const TaskBar = () => {
    const { exitRoom } = useContext(SocketContext);

    return (
      <div className="TaskBar">
        <div className="LOGOROOM"> 
          <AiFillWechat size={50} color='hsl(256, 72%, 77%)'/>
          <div style={{marginLeft: '10px'}}>KothaHok</div>
        </div>
        <div onClick={() => exitRoom()} className="ExitRoom">
          LEAVE
          <AiOutlineArrowRight size={20} color='white'/>
        </div>
      </div>
    );
}

export default TaskBar