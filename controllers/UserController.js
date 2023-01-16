import User from '../models/User.js'
import bcrypt from 'bcrypt'
import fs from 'fs'

//helpers
import getUserByToken from '../helpers/get-user-by-token.js'
import createUserToken from '../helpers/create-user-token.js'
import getToken from '../helpers/get-token.js'

class UserController {

    static async register(req, res) {
        const { name, password, confirmPassword, email, phone } = req.body

        //validations
        if (!name) return res.status(422).json({ error: "Missing field name" })
        if (!email) return res.status(422).json({ error: "Missing field email" })
        if (!phone) return res.status(422).json({ error: "Missing field phone" })
        if (!password) return res.status(422).json({ error: "Missing field password" })
        if (!confirmPassword) return res.status(422).json({ error: "Missing field confirmPassword" })

        if (password !== confirmPassword) return res.status(422).json({ error: "Passwords do not match" })

        const userExist = await User.findOne({ email: email })

        if (userExist) return res.status(422).json({ error: "E-mail already registered." })

        //create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //register user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (e) {
            res.status(500).json({ message: e })
        }

    }

    static async login(req, res) {
        const { email, password } = req.body

        //validation
        if (!email) return res.status(422).json({ error: "Missing field email" })
        if (!password) return res.status(422).json({ error: "Missing field password" })

        const user = await User.findOne({ email: email })

        if (!user) return res.status(422).json({ error: "Invalid data" })

        //validate password
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return res.status(422).json({ error: "Invalid data" })

        //return token
        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {
        let currentUser = null

        if (req.headers.authorization) {

            const token = getToken(req)
            currentUser = await getUserByToken(token)
        }

        res.status(200).json(currentUser)
    }

    static async getUser(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)

        return res.status(200).json(user)

    }

    static async editUser(req, res) {

        const token = getToken(req)
        const user = await getUserByToken(token)


        const { name, email, phone } = req.body

        let image = ''

        if (req.file) {
            image = req.file.filename
        }

        if (!name) return res.status(422).json({ error: "Missing field name" })

        if (!email) return res.status(422).json({ error: "Missing field email" })

        const findByEmail = await User.findOne({ email: email })

        if (user.email !== email && findByEmail) {
            return res.status(422).json({ error: "Email already registered" })
        }


        if (!phone) return res.status(422).json({ error: "Missing field phone" })

        try {

            if (image !== '' && user.image) {
                fs.unlink(`public/images/users/${user.image}`, err => {
                    if (err) return console.log(err)
                })
            }

            await User.updateOne({ _id: user._id }, {
                $set: {
                    name,
                    email,
                    phone,
                    image: image !== '' ? image : user.image
                }
            })


            res.status(200).json({
                message: "User data updated."
            })

        } catch (e) {
            res.status(500).json({ message: e })
        }

    }

    static async changePassword(req, res) {

        const email = req.params.email

        const user = await User.findOne({ email: email })
        if (!user) res.status(404).json({ error: "User not found" })


        const { password, confirmPassword } = req.body

        if (!password) return res.status(422).json({ error: "Missing field password" })
        if (!confirmPassword) return res.status(422).json({ error: "Missing field confirmPassword" })

        if (password !== confirmPassword) return res.status(422).json({ error: "As senhas devem ser iguais" })

        const checkPassword = await bcrypt.compare(password, user.password)
        if (checkPassword) return res.status(422).json({ error: "Senha já utilizada, tente novamente" })

        const salt = await bcrypt.genSalt(12)
        const newPassword = await bcrypt.hash(password, salt)

        try {
            await User.updateOne({ email: email }, { password: newPassword })
            res.status(200).json({ message: "Password changed" })
        } catch (e) {
            res.status(500).json({ error: e })
        }

    }

}

export default UserController