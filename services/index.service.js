const axios = require("axios")

const getAllIndexes = async (_, res) => {
    try {
        const response = await axios.get(
            `${process.env.TWELVE_LABS_BASE_URL}/indexes?page=1&page_limit=1&sort_by=created_at&sort_option=desc`,
            {
                headers: {
                    "x-api-key": `${process.env.TWELVE_LABS_API_KEY}`
                }
            }
        )

        if(response?.status === 200) {
            return res.status(200).send(response?.data?.data)
        }

        return res.sendStatus(500)
    }
    catch(err) {
        console.error(err)
        return res.sendStatus(500)
    }
}

module.exports = {
    getAllIndexes
}