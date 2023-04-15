import React, { useEffect, useRef, useContext } from "react"
import { SocketContext } from "../../Socket/Context"
import "./Room.css"

const Video = (props) => {
    const { item } = props
    const ref = useRef()

    useEffect(() => {
        item.peer.on("stream", stream => {
            ref.current.srcObject = stream
        })
    }, [item.peer])

    return (
        <div className="VideoArea">
            <video playsInline autoPlay ref={ref} className="VideoSection"/>
            <div className="NameSection">{item.userName}</div>
        </div>
    )
}

const VideoChat = () => {
    const { name, userStream, peers } = useContext(SocketContext);

    const ref = useRef()

    useEffect(() => {
        ref.current.srcObject = userStream
    }, [userStream])

    return (
        <div className="VideoChat">
            <div className="VideoArea">
                <video muted ref={ref} autoPlay playsInline className="VideoSection"/>
                <div className="NameSection">{name}</div>
            </div>
            
            {peers.map((item, index) => {
                return (
                    <Video key={index} item={item} />
                )
            })}
        </div>
    )
}

export default VideoChat
