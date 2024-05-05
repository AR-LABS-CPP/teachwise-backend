const router = require("express").Router()
const uploader = require("../config/multer.config")
const {
    getAllVideosOfIndex,
    uploadVideoForIndexing,
    getVideoInformation,
    deleteVideo
} = require("../services/video.service")

router.get("/:indexId", getAllVideosOfIndex)

router.post("/:indexId/upload", uploader.single("videoFile"), uploadVideoForIndexing)

router.get("/:indexId/:videoId", getVideoInformation)

router.delete("/:indexId/:videoId", deleteVideo)

module.exports = router