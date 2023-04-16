import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

//const socket = io.connect('http://localhost:5000')
const socket = io.connect('https://kothahok.onrender.com')

const SocketContext = createContext();

const ContextProvider = ({ children }) => {
    const [showRoom, setShowRoom] = useState(false)
    const [name, setName] = useState('')
    const [roomID, setRoomID] = useState('')
    const [peers, setPeers] = useState([])
    const [userStream, setUserStream] = useState()
    const [textMessageList, setTextMessageList] = useState([])
    const socketRef = useRef()
    const peersRef = useRef([])

	socketRef.current = socket

    useEffect(() => {
        if(showRoom) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                setUserStream(stream)
                socketRef.current.emit("join room", name, roomID)
                socketRef.current.on("all users", (users, socketToName) => {
                    const peers = []
                    users.forEach(userID => {
                        const peer = createPeer(userID, socketRef.current.id, stream)
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        peers.push({
                            userName: socketToName[userID],
                            socketID: userID,
                            peer
                        })
                        setTextMessageList(list => [...list, { text: `${socketToName[userID]} joined the room`, senderName: 'SYSTEM101' }])
                    })
                    setPeers(peers)
                })
    
                socketRef.current.on("user joined", (payload, userName) => {
                    const peer = addPeer(payload.signal, payload.callerID, stream)
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
    
                    setPeers(users => [...users, { userName, socketID: payload.callerID, peer }])
                    setTextMessageList(list => [...list, { text: `${userName} just join the room`, senderName: 'SYSTEM101' }])
                })
    
                socketRef.current.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id)
                    if(item) {
                        item.peer.signal(payload.signal)
                    }
                })
    
                socketRef.current.on("DISCONNECT-A-CLIENT", (id, name) => {
                    const item = peersRef.current.find(p => p.peerID === id)
                    if(item) {
                        peersRef.current = peersRef.current.filter(p => p.peerID !== id)
                        setPeers(users => users.filter(user => user.peer !== item.peer))
                        if(item.peer) {
                            item.peer.destroy()
                        }
                    }
                    //window.location.reload()
                    if(name) {
                        setTextMessageList(list => [...list, { text: `${name} leave the room`, senderName: 'SYSTEM101' }])
                    }
                })
            })

            socketRef.current.on("RECEIVE-TEXT", (text, senderName) => {
                setTextMessageList(list => [...list, { text, senderName }])
            })
        }
    }, [showRoom])

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        peer.on('error', function (err) {
			console.log('Peer error - ', err)
		})

        peer.on('close', function () {
			console.log('Peer close.')
		})

        return peer
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal)

        peer.on('error', function (err) {
			console.log('Peer error - ', err)
		})

        peer.on('close', function () {
			console.log('Peer close.')
		}) 

        return peer
    }

    function exitRoom() {
        window.location.reload()
    }

    function sendTextMessage(text) {
        socketRef.current.emit('SEND-TEXT', text)
    }

  return (
    <SocketContext.Provider value={{
      showRoom,
      setShowRoom,
      name,
      setName,
      roomID,
      setRoomID,
      peers,
      setPeers,
      userStream,
      exitRoom,
      sendTextMessage,
      textMessageList,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };