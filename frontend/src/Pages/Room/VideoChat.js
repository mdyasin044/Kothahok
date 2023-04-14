import React, { useEffect, useRef, useState } from "react"
import Peer from "simple-peer"
import io from "socket.io-client"
import "./Room.css"

//const socket = io.connect('http://localhost:5000')
const socket = io.connect('https://kothahok.onrender.com')

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video playsInline autoPlay ref={ref} style={{height: '200px', width: '300px'}}/>
    );
}

const VideoChat = () => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = 'room1';

	socketRef.current = socket;

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            socketRef.current.on("DISCONNECT-A-CLIENT", id => {
                const item = peersRef.current.find(p => p.peerID === id);
                peersRef.current = peersRef.current.filter(p => p.peerID !== id);
                setPeers(users => users.filter(user => user !== item.peer));
                //item.peer.destroy();
            });
        })

    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        peer.on('error', function (err) {
			console.log('Peer error - ', err)
		});

        peer.on('close', function () {
			console.log('Peer close.')
		});

        return peer;
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

        peer.signal(incomingSignal);

        peer.on('error', function (err) {
			console.log('Peer error - ', err)
		});

        peer.on('close', function () {
			console.log('Peer close.')
		}); 

        return peer;
    }

    return (
        <div className="VideoChat">
            <video muted ref={userVideo} autoPlay playsInline style={{height: '200px', width: '300px'}}/>
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </div>
    );
}

export default VideoChat
