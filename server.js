import express from "express"
import path from "path"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import rootRoutes from "./routes/root.js"
import boardRoutes from "./routes/board.js"
import { createServer } from "http"
import { initSocket } from "./socket.js"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()
const server = createServer(app)
const io = initSocket(server)

const roomData = {}

io.on("connection", (socket) => {
  console.log("Connected with socket-id", socket.id)

  socket.on("join-room", async (roomName) => {
    await joinRoom(roomName, socket)
    io.to(socket.roomName).emit("room-state", `${socket.id} joined the room`)
    io.to(socket.id).emit("rect-data", roomData[socket.roomName].rectData)
  })

  socket.on("mouse-position", (cords) => {
    if (!socket.roomName) return
    socket
      .to(socket.roomName)
      .emit("broadcasted-mouse-position", { cords, id: socket.id })
  })
  socket.on("server-create-rect", (data) => {
    if (!socket.roomName) return
    socket.to(socket.roomName).emit("create-rect", data)
  })
  socket.on("server-push-rect", (data) => {
    if (!socket.roomName) return
    roomData[socket.roomName].rectData.push(data)
    socket.to(socket.roomName).emit("push-rect", data)
  })
  socket.on("server-move-rect", (data) => {
    if (!socket.roomName) return
    roomData[socket.roomName].rectData[data.index].x = data.x
    roomData[socket.roomName].rectData[data.index].y = data.y
    socket.to(socket.roomName).emit("move-rect", data)
  })
  socket.on("server-scale-rect", (data) => {
    if (!socket.roomName) return
    roomData[socket.roomName].rectData[data.index].x = data.x
    roomData[socket.roomName].rectData[data.index].y = data.y
    roomData[socket.roomName].rectData[data.index].width = data.width
    roomData[socket.roomName].rectData[data.index].height = data.height
    socket.to(socket.roomName).emit("scale-rect", data)
  })
  socket.on("server-delete-rect", (data) => {
    if (!socket.roomName) return
    roomData[socket.roomName].rectData.splice(data, 1)
    socket.to(socket.roomName).emit("delete-rect", data)
  })

  socket.on("disconnect", (reason) => {
    io.to(socket.roomName).emit("room-state", `${socket.id} disconneted`)
  })
})

app.set("view engine", "ejs")
app.set(express.static(path.join("/public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

server.listen(PORT, () => console.log("server at port", PORT))

app.use("/", rootRoutes)
app.use("/board", boardRoutes)

async function joinRoom(roomName, socket) {
  if (!roomData[roomName]) {
    roomData[roomName] = {
      rectData: [],
    }
  }
  await socket.join(roomName)
  socket.roomName = roomName
}
