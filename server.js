import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import auth from "./api/auth.route.js"
import udpecho from "./api/udpecho.route.js"
import tcpecho from "./api/tcpecho.route.js"

const app = express()

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: ['http://193.122.103.95', 'https://193.122.103.95']
}))
app.use(express.json())

app.use("/api/v1/auth", auth)
app.use("/api/v1/udpecho", udpecho)
app.use("/api/v1/tcpecho", tcpecho)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

export default app