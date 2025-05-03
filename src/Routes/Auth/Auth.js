import express, { response } from "express";
const Auth = express.Router();
Auth.use(express.json());
import Response from "../../Standards/Response.js";
import User from "../../db/Users.js";
import Password from "../../utils/password.js";
import {generateToken , verifyToken} from '../../utils/JWT.js'
import Check,{CheckWithSpecialCharacters} from '../../utils/InputValidation.js';
import AdminAuth from "../Admin/AdminAuth.js";


Auth.post("/login",async(req, res) => {
    const data = req.body
    if (data){
        const username = data.username
        const password = data.password
        if (username && password){
            try{
                if(!Check(username)){
                    let response = Response(401,"Invalid Username, Only Use a-zA-Z",{})
                    return res.status(401).json(response)
                }if(!CheckWithSpecialCharacters(password)){
                    let response = Response(401,"Invalid Password, Only Use a-zA-Z and @#!$^&*()",{})
                    return res.status(401).json(response)
                }
                const user = await User.findOne({$or:[{username},{username:username}]})
                if(user){
                    let isPasswordMatch = await Password.varify(password,user.password)
                    if(isPasswordMatch){
                        let token = generateToken({id:user._id,"isAdmin":false},3)
                        if (token){
                            let response = Response(200, "login successful", {})
                            res.cookie("AuthToken",token,{httpOnly:true,secure:false,maxAge: 2 * 24 * 60 * 60 * 1000})
                            return res.status(response.status).json(response)
                        }else{
                            let response = Response(401, "login failed Please try again", {})
                            return res.status(response.status).json(response)
                        }
                    }else{
                        let response = Response(200, "Invalid Username or Password",{})
                        return res.status(response.status).json(response)
                    }
                }else{
                    console.log("Password mismatch",+password)
                    let response = Response(401, "Invalid Username or password", {})
                    return res.status(response.status).json(response)
                }
            }
            catch(error){
                console.log(error)
                let response = Response(401, "login failed Please try again", {})
                return res.status(response.status).json(response)
            }
        }else{
            let response = Response(401, "Please fill all the fields", {})
            return res.status(response.status).json(response)
        }
    }
    else{
        let response = Response(401, "Please fill all the fields", {})
        return res.status(response.status).json(response)
    }
});

Auth.post("/signup", async(req, res) => {
    const data = req.body
    if (data){
        const username = data.username
        const email = data.email
        let password = data.password
        if (username && email && password){
            try{
                if(!Check(username)){
                    let response = Response(401,"Invalid Username, Only Use a-zA-Z",{})
                    return res.status(response.status).json(response)
                }
                if(!CheckWithSpecialCharacters(password)){
                    let response = Response(401,"Invalid Password , Only Use a-zA-Z and @#!$^&*()")
                    return res.status(response.status).json(response)
                }
                if(password.length < 8){
                    let response = Response(401, "Password must be at least 8 characters long", {})
                    return res.status(response.status).json(response)
                }
                else{
                    password = await Password.make(password)
                    if (password){
                        const user = await User.create({username,email,password})
                        if (user){
                            let response = Response(200,"User is created successful",{})
                            return res.status(response.status).json(response)
                        }else{
                            let response = Response(401, "signup failed! Please try again later", {})
                            return res.status(response.status).json(response)
                        }
                    }
                    else{
                        let response = Response(401, "Password is not valid! Please Try Different Password", {})
                        return res.status(response.status).json(response)
                    }
                }
            }catch(error){
                if(error.code == 11000){
                    let response = Response(401, "Email or Username is already in use", {})
                    return res.status(response.status).json(response)
                }
                else if (error.errors?.email?.properties?.message){
                    let response = Response(401, error.errors.email.properties.message, {})
                    return res.status(response.status).json(response)
                }
                else if (error.errors?.password?.properties?.message){
                    let response = Response(401, error.errors.password.properties.message, {})
                    return res.status(response.status).json(response)
                }
                else if (error.errors?.username?.properties?.message){
                    let response = Response(401, error.errors.username.properties.message, {})
                    return res.status(response.status).json(response)
                }
                else{
                    console.log(error)
                    let response = Response(401, "signup failed! Please try again later", {})
                    return res.status(response.status).json(response)
                }
            }
        }else{
            let response = Response(401, "Please fill all the fields", {})
            return res.status(response.status).json(response)
        }
    }else{
        const response = new Response(401, "Please fill all the fields", {})
        return res.status(response.status).json(response)
    }
});

Auth.get("/logout", (req, res) => {
    res.clearCookie("AuthToken")
    const response = Response(200,"",{})
    return res.status(200).json(response)

});


export default Auth;