import express from 'express'
import UserController from '../controllers/UserController.js'
import verifyToken from '../helpers/verify-token.js'
import imageUpload from '../helpers/image-upload.js'
const router = express.Router()


router.get("/checkUser", UserController.checkUser)
router.get("/find", verifyToken, UserController.getUser)

router.post("/register", UserController.register)
router.post("/login", UserController.login)

router.patch('/edit', verifyToken, imageUpload.single("image"), UserController.editUser)
router.patch('/edit/password/:email', UserController.changePassword)


export default router