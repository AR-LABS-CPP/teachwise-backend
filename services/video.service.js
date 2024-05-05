const axios = require("axios")
const path = require("path")
const fs = require("fs")
const fsp = require("fs/promises")
const fetch = require("node-fetch")
const FormData = require("form-data")

const getVideoInformation = async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.TWELVE_LABS_BASE_URL}/indexes/${req.params.indexId}/videos/${req.params.videoId}`,
            {
                headers: {
                    "x-api-key": `${process.env.TWELVE_LABS_API_KEY}`
                }
            }
        )

        if(response.status === 200) {
            return res.status(200).send(response.data)
        }

        return res.sendStatus(500)
    }
    catch(err) {
        console.error(err)
        return res.sendStatus(500)
    }
}

const deleteVideo = async (req, res) => {
    try {
        const response = await axios.delete(
            `${process.env.TWELVE_LABS_BASE_URL}/indexes/${req.params.indexId}/videos/${req.params.videoId}`,
            {
                headers: {
                    "x-api-key": `${process.env.TWELVE_LABS_API_KEY}`
                }
            }
        )

        console.debug(response)

        if(response.status === 204) {
            return res.status(200).send("Video has been deleted successfully")
        }

        return res.sendStatus(500)
    }
    catch(err) {
        console.error(err)
        return res.sendStatus(500)
    }
}

const getAllVideosOfIndex = async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.TWELVE_LABS_BASE_URL}/indexes/${req.params.indexId}/videos?page=1&page_limit=10&sort_by=created_at&sort_option=desc`,
            {
                headers: {
                    "x-api-key": `${process.env.TWELVE_LABS_API_KEY}`
                }
            }
        )

        if(response?.status === 200) {
            // Need to manually fetch information for each video
            let videoInfoPromises = []   

            for(const videoData of response?.data?.data) {
                videoInfoPromises.push(
                    axios.get(
                        `${process.env.TWELVE_LABS_BASE_URL}/indexes/${req.params.indexId}/videos/${videoData?._id}`,
                        {
                            headers: {
                                "x-api-key": `${process.env.TWELVE_LABS_API_KEY}`
                            }
                        }
                    )
                )
            }

            const videoInfoResponses = await Promise.all(videoInfoPromises)
            const formattedVideoInfoResponses = videoInfoResponses.map(videoInfoResponse => videoInfoResponse?.data)

            return res.status(200).send(formattedVideoInfoResponses)
        }
        
        return res.sendStatus(500)
    }
    catch(err) {
        console.error(err)
        return res.sendStatus(500)
    }
}

/*
    Due to limited time, I switched to node-fetch
    because the axios format in twelvelabs docs was 
    confusing
*/
const uploadVideoForIndexing = async (req, res) => {    
    try {
        switch(req.body?.videoInputType) {
            case "url":
                try {
                    const formData = new FormData()
                    formData.append("provide_transcription", "false")
                    formData.append("language", "en")
                    formData.append("disable_video_stream", "false")
                    formData.append("index_id", req.params.indexId)
                    formData.append("video_url", req.body.videoUrl)

                    const URL = `${process.env.TWELVE_LABS_BASE_URL}/tasks`
                    const OPTIONS = {
                        method: "POST",
                        headers: {
                            accept: "application/json",
                            "x-api-key": `${process.env.TWELVE_LABS_API_KEY}`
                        },
                        body: formData
                    }

                    const response = await fetch(URL, OPTIONS)
                    const jsonResponse = await response.json()

                    await fsp.unlink(filePath)

                    return res.status(200).send(jsonResponse?._id)
                }
                catch(err) {
                    console.error(err)
                    return res.sendStatus(500)
                }

            case "file":
                try {
                    const filePath = path.join(__dirname, "..", "uploads", req.file.originalname)

                    const formData = new FormData()
                    formData.append("provide_transcription", "false")
                    formData.append("language", "en")
                    formData.append("disable_video_stream", "false")
                    formData.append("index_id", req.params.indexId)
                    formData.append("video_file", fs.createReadStream(filePath))
                    
                    const URL = `${process.env.TWELVE_LABS_BASE_URL}/tasks`
                    const OPTIONS = {
                        method: "POST",
                        headers: {
                            accept: "application/json",
                            "x-api-key": `${process.env.TWELVE_LABS_API_KEY}`
                        },
                        body: formData
                    }

                    const response = await fetch(URL, OPTIONS)
                    const jsonResponse = await response.json()

                    await fsp.unlink(filePath)

                    return res.status(200).send(jsonResponse?._id)
                }
                catch(err) {
                    console.error(err)
                    return res.sendStatus(500)
                }

            default:
                return res.status(400).send("Please send a video as a URL or a file")
        }
    }
    catch(err) {
        console.error(err)
        return res.sendStatus(500)
    }
}

const getVideoIndexingStatus = async (req, res) => {
    try {

    }
    catch(err) {
        console.error(err)
        return res.sendStatus(500)
    }
}

module.exports = {
    getVideoInformation,
    deleteVideo,
    getAllVideosOfIndex,
    uploadVideoForIndexing,
    getVideoIndexingStatus
}