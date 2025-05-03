import jwt from "jsonwebtoken";

const generateToken = (data,expiresIn) => {
    const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: `${expiresIn}d`})
    if (token){
        return token
    }else{
        return false
    }
}

const verifyToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded){
        return decoded
    }else{
        return false
    }
}
export {generateToken, verifyToken};
