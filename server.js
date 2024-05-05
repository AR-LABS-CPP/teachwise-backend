require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

const PORT = process.env.PORT || 3040

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("short"))

const videoRouter = require("./routes/video.routes")
const conversationRouter = require("./routes/conversation.routes")
const indexRouter = require("./routes/index.routes")

app.use("/indexes", indexRouter)
app.use("/videos", videoRouter)
app.use("/conversation", conversationRouter)

app.get("/heartbeat", (_, res) => {
    return res.sendStatus(200)
})     

app.listen(PORT, () => {
    console.debug(`[server]: listening on port: ${PORT}`)
})