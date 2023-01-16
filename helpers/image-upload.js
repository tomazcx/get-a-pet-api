import multer from 'multer'
import path from 'path'

const imageStore = multer.diskStorage({
    destination: (req, file, cb) => {

        let folder = ''

        if (req.baseUrl.includes("user")) {
            folder = 'users'
        } else if (req.baseUrl.includes("pet")) {
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)

    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStore,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Only pngs or jpgs allowed"))
        }
        cb(undefined, true)
    }

})

export default imageUpload