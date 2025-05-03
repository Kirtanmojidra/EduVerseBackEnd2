import bcrypt from 'bcrypt';

async function  make(password){
    const hash = await bcrypt.hash(password, 10)
    if (hash){
        return hash
    }else{
        return false
    }
}

async function varify(password,hashedPassword){
    const varify = await bcrypt.compare(password,hashedPassword)
    if (varify){
        return true
    }else{
        return false
    }
}
export default {make,varify};
