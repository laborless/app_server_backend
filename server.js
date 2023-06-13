import express from "express"
import cors from "cors"
import udpecho from "./api/udpecho.route.js"

const app = express()

app.use(cors({
  credentials: true,
  origin: ['http://193.122.103.95', 'https://193.122.103.95']
}))
app.use(express.json())

app.use("/api/v1/udpecho", udpecho)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

export default app