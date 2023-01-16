import jwt from 'jsonwebtoken'
import getToken from './get-token.js'

//middleware to validate token
const checkToken = (req, res, next) => {

    if (!req.headers.authorization) return res.status(401).json({ message: "Access denied" })

    const token = getToken(req)

    if (!token) return res.status(401).json({ message: "Access denied" })

    try {

        const verified = jwt.verify(token, "nossosecret")

        req.user = verified
        next()

    } catch (err) {
        return res.status(401).json({ message: err })
    }

}

export default checkToken