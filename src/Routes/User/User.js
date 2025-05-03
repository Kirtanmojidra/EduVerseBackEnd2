import express from "express";
import Response from "../../Standards/Response.js";
import User from "../../db/Users.js";
import {verifyToken} from '../../utils/JWT.js'
const UserRoutes = express.Router();
UserRoutes.get("",async(req , res)=> {
    const cookie = req.cookies.AuthToken;
    if (cookie){
        try{
            const userId = verifyToken(cookie)
        
            if(userId){
                const user = await User.findById(userId.id).select('-password -createdAt -updatedAt -_id -__v')
                console.log(user)
                const response = Response(200,"success",{user})
                res.status(response.status).json(response)
                
            }else {
                const response = Response(401,"Invalid Credentials",{})
                res.status(401).json(response)
            }
        }
        catch(error){
            if(error.name){
                if(error.name === 'JsonWebTokenError'){
                    const response = Response(401,"Invalid Credentials",{})
                    res.status(401).json(response)
                }
                else if(error.name === 'TokenExpiredError'){
                    const response = Response(401,"Token Expired",{})
                    res.status(401).json(response)
                }
                else{
                    const response = Response(500,"Internal Server Error",{})
                    res.status(response.status).json(response)
                }
            }
            const response = Response(500,"Internal Server Error",{})
            res.status(response.status).json(response)
        }

    }
    else{
        const response = Response(401,"No User Found",{})
        res.status(response.status).json(response)
    }
})


export default UserRoutes
