const { TwelveLabs } = require("twelvelabs-js")

const twelvelabsClient = new TwelveLabs({
    apiKey: process.env.TWELVE_LABS_API_KEY
})

module.exports = twelvelabsClient