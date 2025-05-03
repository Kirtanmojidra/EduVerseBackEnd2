import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        match:[/^[a-zA-Z0-9]+$/,"Username must contain only letters and numbers"],
        minlength:[8,"Username must be at least 6 characters long"],
        maxlength:[20,"Username must be at most 20 characters long"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^\S+@gmail\.\S+$/,"Studyverse only allows gmail"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password must be at least 8 characters long"],
    },
},{timestamps:true})
export default  mongoose.model("Admin", AdminSchema)