import PetController from "../controllers/PetController.js";
import express from 'express'
import verifyToken from '../helpers/verify-token.js'
import imageUpload from '../helpers/image-upload.js'
const router = express.Router()

router.get("/all", PetController.getAll)
router.get("/mypets", verifyToken, PetController.getAllUserPets)
router.get("/myadoptions", verifyToken, PetController.getAllUserAdoptions)
router.get("/:id", PetController.getPetById)

router.post("/register", verifyToken, imageUpload.array("images"), PetController.register)

router.patch("/:id", verifyToken, imageUpload.array("images"), PetController.updatePet)
router.patch("/schedule/:id", verifyToken, PetController.schedule)
router.patch("/schedule/finish/:id", verifyToken, PetController.finishAdoption)
router.patch("/schedule/cancel/:id", verifyToken, PetController.cancelAdoption)

router.delete("/:id", verifyToken, PetController.deletePetById)

export default router