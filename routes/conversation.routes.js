const { conversateWithModel } = require("../services/conversation.service")

const router = require("express").Router()

router.post("/:videoId", conversateWithModel)

module.exports = router