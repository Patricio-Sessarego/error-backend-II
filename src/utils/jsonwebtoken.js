import jwt from 'jsonwebtoken'

const private_key = "palabraSecretaParaToken"

const generateToken = (user) => {
    //FECHA DE EXPIRACION --> 'expiresIn'
    const token = jwt.sign(user , private_key , { expiresIn: "24h" })
    return token
}

export default generateToken