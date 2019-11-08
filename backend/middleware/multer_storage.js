const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => { // przy zapisie
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type !")
        if (isValid) {
            error = null
        }
        cb(error, "./backend/images") // sciezka jest relatywna do naszego server.js
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
})


module.exports= multer({ storage: storage }).single("image")