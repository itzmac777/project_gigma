import { Server } from "socket.io"
let io
const roomData = {}

export function initSocket(server) {
  io = new Server(server)
  return io
}

export function socketIoConnection() {
  io.on("connection", (socket) => {
    console.log("Connected with socket-id", socket?.id)

    socket.on("join-room", async (roomName) => {
      await joinRoom(roomName, socket)
      io.to(socket?.roomName).emit(
        "room-state",
        `${socket?.id} joined the room`
      )
      io.to(socket?.roomName).emit("room-members", roomData[roomName]?.members)
      io.to(socket?.id).emit("rect-data", roomData[socket?.roomName]?.rectData)
    })

    socket.on("mouse-position", (cords) => {
      if (!socket?.roomName) return
      socket
        ?.to(socket?.roomName)
        ?.emit("broadcasted-mouse-position", { cords, id: socket?.id })
    })
    socket.on("server-create-rect", (data) => {
      if (!socket?.roomName) return
      socket?.to(socket?.roomName)?.emit("create-rect", data)
    })
    socket?.on("server-push-rect", (data) => {
      if (!socket?.roomName) return
      roomData[socket?.roomName]?.rectData?.push(data)
      socket?.to(socket?.roomName)?.emit("push-rect", data)
    })
    socket?.on("server-move-rect", (data) => {
      if (!socket?.roomName) return
      if (
        !roomData[socket?.roomName].rectData[data?.index]?.x ||
        !roomData[socket?.roomName].rectData[data?.index]?.y
      ) {
        return
      }
      roomData[socket?.roomName].rectData[data?.index].x = data?.x
      roomData[socket?.roomName].rectData[data?.index].y = data?.y
      socket?.to(socket?.roomName)?.emit("move-rect", data)
    })
    socket.on("server-scale-rect", (data) => {
      if (!socket?.roomName) return
      roomData[socket?.roomName].rectData[data?.index].x = data?.x
      roomData[socket?.roomName].rectData[data?.index].y = data?.y
      roomData[socket?.roomName].rectData[data?.index].width = data?.width
      roomData[socket?.roomName].rectData[data?.index].height = data?.height
      socket.to(socket?.roomName)?.emit("scale-rect", data)
    })
    socket.on("server-delete-rect", (data) => {
      if (!socket?.roomName) return
      roomData[socket?.roomName]?.rectData?.splice(data, 1)
      socket.to(socket?.roomName)?.emit("delete-rect", data)
    })

    socket.on("disconnect", (reason) => {
      io.to(socket?.roomName).emit("room-state", `${socket?.id} disconneted`)
      if (roomData[socket?.roomName]?.members?.length > 0) {
        roomData[socket?.roomName].members = roomData[
          socket?.roomName
        ].members?.filter((id) => id !== socket?.id)
      }
    })
  })
}

async function joinRoom(roomName, socket) {
  if (!roomData[roomName]) {
    roomData[roomName] = {
      rectData: [],
      members: [socket.id],
    }
  } else {
    roomData[roomName].members.push(socket.id)
  }
  await socket.join(roomName)
  socket.roomName = roomName
}
