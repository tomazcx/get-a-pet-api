import getUserByToken from './get-user-by-token.js'

const verifyOwner = async(token, pet, res) => {
    const user = await getUserByToken(token)

    if (!pet.owner._id.equals(user._id)) return res.status(403).json({ error: "Action not allowed" })
}

export default verifyOwner