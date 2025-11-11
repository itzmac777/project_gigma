import express from "express"
import path from "path"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import rootRoutes from "./routes/root.js"
import boardRoutes from "./routes/board.js"
import { createServer } from "http"
import { initSocket, socketIoConnection } from "./socket.js"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()
const server = createServer(app)
const io = initSocket(server)

socketIoConnection()

app.set("view engine", "ejs")
app.set(express.static(path.join("/public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

server.listen(PORT, () => console.log("server at port", PORT))

app.use("/", rootRoutes)
app.use("/board", boardRoutes)
