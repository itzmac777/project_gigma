import { Server } from "socket.io"
let io

export function initSocket(server) {
  io = new Server(server)
  return io
}

export function getIo() {
  return io
}
