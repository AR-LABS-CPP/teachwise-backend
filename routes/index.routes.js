const { getAllIndexes } = require("../services/index.service")

const router = require("express").Router()

router.get("/", getAllIndexes)

module.exports = router