import Admin from '../db/Admins.js'
import Response from '../Standards/Response.js'
import {verifyToken} from '../utils/JWT.js'

const  AdminCheck = async(req, res, next) =>{
    try{
        const cookie = req.cookies.AuthToken;
        if(cookie){
            const user = verifyToken(cookie)
            if(user && user.isAdmin == true){
                const adminUser = await Admin.findOne({id:user.id}).select("-password -createdAt -updatedAt -_id -__v")
                req.user=user
                next()
            }else{
                let response = Response(403,"Please Login as Admin To Perfom This Action",{})
                res.status(response.status).json(response)
            }
        }else{
            let response = Response(401,"Please Login As Admin To Perfom This Action",{})
            res.status(response.status).json(response)
        }
    }
    catch(e){
        console.log("Error : "+e)
        let response = Response(500,"Internal Server Error",{})
        return res.status(response.status).json(response)

    }
}

export default AdminCheck;