import Pet from '../models/Pet.js'
import fs from 'fs'

//helpers
import getUserByToken from '../helpers/get-user-by-token.js'
import verifyOwner from '../helpers/verify-owner.js'
import getToken from '../helpers/get-token.js'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

class PetController {

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json(pets)

    }

    static async getAllUserPets(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const myPets = await Pet.find({ 'owner._id': user._id })

        res.status(200).json(myPets)
    }

    static async getAllUserAdoptions(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        const myPets = await Pet.find({ 'adopter._id': user._id })

        res.status(200).json(myPets)
    }

    static async getPetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) return res.status(422).json({ error: "Not a valid id" })

        const pet = await Pet.findById(id)

        if (!pet) res.status(404).json({ error: "Pet not found" })

        res.status(200).json(pet)
    }


    static async register(req, res) {

        const { name, age, weight, color } = req.body

        const images = req.files

        if (!name) return res.status(422).json({ error: "Missing field name" })
        if (!age) return res.status(422).json({ error: "Missing field age" })
        if (!weight) return res.status(422).json({ error: "Missing field weight" })
        if (!color) return res.status(422).json({ error: "Missing field color" })
        if (images.length === 0 || images === undefined) return res.status(422).json({ error: "Missing field images" })

        const token = getToken(req)
        const user = await getUserByToken(token)


        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: true,
            images: [],
            owner: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            },
            adopter: {}
        })

        images.map(image => {
            pet.images.push(image.filename)
        })


        try {
            const newPet = await pet.save()
            return res.status(201).json(newPet)

        } catch (e) {
            return res.status(500).json({ error: e })
        }
    }

    static async updatePet(req, res) {

        const id = req.params.id

        const pet = await Pet.findById(id)

        if (!pet) return res.status(404).json({ error: "Pet not found" })

        const token = getToken(req)

        verifyOwner(token, pet, res)

        const { name, weight, color, age } = req.body

        const images = req.files

        if (!name) return res.status(422).json({ error: "Missing field name" })

        pet.name = name

        if (!age) return res.status(422).json({ error: "Missing field age" })

        pet.age = age

        if (!weight) return res.status(422).json({ error: "Missing field weight" })

        pet.weight = weight

        if (!color) return res.status(422).json({ error: "Missing field color" })

        pet.color = color


        if (images.length > 0) {
            pet.images = []

            images.map(image => {
                pet.images.push(image.filename)
            })
        }

        try {
            const newPet = await Pet.findByIdAndUpdate({ _id: id }, pet, { new: true })

            return res.status(200).json({ message: newPet })
        } catch (err) {
            res.status(500).json({ error: err })
        }




    }

    static async deletePetById(req, res) {

        const id = req.params.id

        const pet = await Pet.findById(id)

        if (!pet) return res.status(404).json({ error: "Pet not found" })

        const token = getToken(req)
        verifyOwner(token, pet, res)

        pet.images.forEach(image => {
            fs.unlink(`public/images/pets/${image}`, err => {
                if (err) return console.log(err)
            })
        })

        const message = await Pet.deleteOne({ _id: id })
        return res.status(200).json(message)
    }


    static async schedule(req, res) {
        const id = req.params.id

        const pet = await Pet.findById(id)

        if (!pet) return res.status(404).json({ error: "Pet not found" })


        const token = getToken(req)
        const user = await getUserByToken(token)

        if (user._id.equals(pet.owner._id)) return res.status(422).json({ error: "Você não pode adotar seu próprio pet." })

        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) return res.status(422).json({ error: "Você ja tem uma visita agendada." })
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
        }

        const message = await Pet.updateOne({ _id: id }, pet)

        return res.status(200).json({ message })

    }

    static async cancelAdoption(req, res) {

        const id = req.params.id

        const pet = await Pet.findById(id)

        if (!pet) return res.status(404).json({ error: "Pet not found" })

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!user._id.equals(pet.owner._id)) return res.status(403).json({ error: "Action not allowed" })

        pet.adopter = null

        const message = await Pet.updateOne({ _id: id }, pet)

        return res.status(200).json({ message })
    }

    static async finishAdoption(req, res) {

        const id = req.params.id

        const pet = await Pet.findById(id)

        if (!pet) return res.status(404).json({ error: "Pet not found" })

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!user._id.equals(pet.owner._id)) return res.status(403).json({ error: "Action not allowed" })

        pet.available = false

        const message = await Pet.updateOne({ _id: id }, pet)

        return res.status(200).json({ message })
    }

}

export default PetController