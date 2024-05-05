const axios = require("axios")

const conversateWithModel = async (req, res) => {
    try {
        const data = {
            prompt: req.body.prompt,
            video_id: req.params.videoId
        }

        const response = await axios.post(
            `${process.env.TWELVE_LABS_BASE_URL}/generate`,
            data,
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

module.exports = {
    conversateWithModel
}