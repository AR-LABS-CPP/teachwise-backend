const multer = require("multer")

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage: multerStorage })

module.exports = uploader