import jwt from 'jsonwebtoken'

const createUserToken = async(user, req, res) => {

    const token = jwt.sign({ //metadados inseridos no token relacionados ao usuário
        name: user.name,
        id: user._id
    }, 'nossosecret', {
        expiresIn: 600 //10 minutes
    })

    res.status(200).json({
        message: 'Authenticated',
        token: token,
        userId: user._id
    })
}

export default createUserToken