import User from '../models/User.js'
import getToken from './get-token.js'
import jwt from 'jsonwebtoken'

const getUserByToken = async(token) => {

    const userInfo = jwt.decode(token, process.env.API_AUTH_SECRET)
    const id = userInfo.id

    const user = await User.findById(id).select('-password')
    return user
}

export default getUserByToken