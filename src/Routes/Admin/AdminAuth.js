import express, { response } from 'express';
import Admin from '../../db/Admins.js'
import Response from '../../Standards/Response.js';
import { generateToken } from '../../utils/JWT.js';

const AdminAuth = express.Router();

AdminAuth.use(express.json());

AdminAuth.post('/login',async(req , res)=>{
    const data = req.body
    try{
        if(data.username && data.password){
            try{
                const admin = await Admin.findOne({$or:[{email:data.username},{username:data.username}]}).select("-createdAt -updatedAt")
                if(admin){
                    if(admin.password === data.password){
                        const token = generateToken({"id":admin.id,"isAdmin":true},2)
                        if(token){
                            res.cookie("AuthToken",token,{maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly:true})
                            let response = new Response(200,"Admin Login Success",{})
                            return res.status(200).json(response)
                        }
                        else{
                            let response = new Response(500,"Internal Server Error Please Try Again",{})
                            return res.status(response.status).json(response)
                        }
                    }
                    else{
                        let response = new Response(403,"Invalid Username or Password",{})
                        return res.status(response.status).json(response)
                    }
                }
                else{
                    let response = new Response(401,"Invalid Username or Password",{})
                    return res.status(response.status).json(response)
                }
            }
            catch(e){
                console.log(e)
                let response = new Response(500,"Internal Server Error Please Try Again",{})
                return res.status(response.status).json(response)
            }
        }else {
            let response = new Response(401,"All Fields are Required")
            return res.status(401).json(response)
        }
    }
    catch(error){
        if(error.code == 11000){
            let response = new Response(403,"Duplicate Standard Name,Please Add New",{})
            res.status(response.status).json(response)
        }
        let response = new Response(500,"Internal Server Error",error)
        return res.status(500).json(response)
    }
})

// AdminAuth.post("/signup",async(req,res)=>{
//     const data = req.body

//     Admin.create({
//         username:data.username,
//         email:data.email,
//         password:data.password
//     })
// })

export default AdminAuth