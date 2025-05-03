import express from 'express';
import AdminCheck from '../../middleware/AdminCheck.js';
import Response from '../../Standards/Response.js';
import { Std } from '../../db/std.js';
import Check from '../../utils/InputValidation.js';
const AdminStandards = express.Router()


AdminStandards.use(express.json())
AdminStandards.use(AdminCheck)
AdminStandards.route("/")
.get(async(req , res)=>{
    try{
        const standards = await Std.find({}).select("-createdAt -updatedAt -__v -_id")
        if(standards.length > 0){
            let response = Response(200,"Standards Found Successfully",standards)
            return res.status(response.status).json(response)
        }else{
            let response = Response(401,"No Standards Found")
            return res.status(response.status).json(response)
        }
    }catch(e){
        if(e.code == 11000){
            let response = Response(401,"Standard name already exists",{})
            return res.status(response.status).json(response)
        }
        else{
            console.log(e)
            let response = Response(401,"Failed to fetch standards")
            return res.status(response.status).json(response)
        }
    }
})
.post(async(req,res)=>{
    const data = req.body
    if(data.name){
        const regex =/^[a-zA-Z0-9 ]+$/;
        if(!regex.test(data.name)){
            let response = Response(401,"Standard name should only have a-z A-Z 0-9 and space",{})
            return res.status(response.status).json(response)
        }
        try{
            const standard = await Std.create({
                name:data.name
            })
            if(standard){
                let response = Response(200,"Standard Is Created",{})
                return res.status(response.status).json(response)
            }
            else{
                let response = Response(400,"Standard Is Not Created Please Try Again")
                return res.status(response.status).json(response)
            }
        }
        catch(e){
            
            if(e.code == 11000){
                let response = Response(403,"Duplicate Standard,Please Add New Standard name",{})
                return res.status(response.status).json(response)
            }
        }
        let response = new Response(200,"Here is name ",{})
        return res.status(response.status).json(response)
    }


}).put(async(req,res)=>{
    
})


export default AdminStandards