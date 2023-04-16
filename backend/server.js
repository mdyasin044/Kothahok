const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://shiny-manatee-eb440f.netlify.app', 'https://kothahok.netlify.app/']
    }
})

const users = {}
const socketToRoom = {}
const socketToName = {}

io.on('connection', socket => {
    console.log('Connected to a new client - ', socket.id)

    socket.on("join room", (name, roomID) => {
        if (users[roomID]) {
            const length = users[roomID].length
            if (length === 4) {
                socket.emit("room full")
                return
            }
            users[roomID].push(socket.id)
        } else {
            users[roomID] = [socket.id]
        }

        socketToRoom[socket.id] = roomID
        socketToName[socket.id] = name
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id)
        console.log(name, ' with socketID - ', socket.id, 'is connected with room - ', roomID)
        console.log('Others members - ', usersInThisRoom)
        socket.emit("all users", usersInThisRoom, socketToName)
    })

    socket.on("sending signal", payload => {
        console.log('user joined')
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID }, socketToName[payload.callerID])
    })

    socket.on("returning signal", payload => {
        console.log('receiving returned signal')
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id })
    })

    socket.on('SEND-TEXT', text => {
        console.log(socket.id, ' sends text - ', text)
        const roomID = socketToRoom[socket.id]
        const senderName = socketToName[socket.id]
        const usersInThisRoom = users[roomID]
        usersInThisRoom.forEach(userID => {
            io.to(userID).emit('RECEIVE-TEXT', text, senderName)
        })
    })

    socket.on('disconnect', () => {
        console.log('Disconnected to a client - ', socket.id)
        socket.broadcast.emit('DISCONNECT-A-CLIENT', socket.id, socketToName[socket.id])
        const roomID = socketToRoom[socket.id]
        let room = users[roomID]
        if (room) {
            room = room.filter(id => id !== socket.id)
            users[roomID] = room
        }
    })
})

server.listen(5000, () => console.log("Server is running on port 5000..."))