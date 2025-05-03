import express from "express";
import 'dotenv/config'
import fs from 'fs';
import path from 'path';
import requestLogger from './middleware/logger.js';
import UserRoutes from "./Routes/User/User.js";
import cookieParser from "cookie-parser";
import Auth from "./Routes/Auth/Auth.js";
import AdminStandards from "./Routes/Admin/Standards.js"
import mongooseConnect from "./db/Connection/connect.js";
import AdminAuth from "./Routes/Admin/AdminAuth.js";
import AdminCheck from "./middleware/AdminCheck.js";

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger)
app.use(cookieParser())


mongooseConnect();

app.get("/",(req,res)=>{
    res.send("hello world express")
})

app.use("/api/user/", Auth);
app.use("/api/user/",UserRoutes);

//Admin endpoints//
app.use("/api/admin/standards",AdminStandards)
app.use('/api/admin',AdminAuth)

const HOST='0.0.0.0'
const PORT=3000
app.listen(PORT, HOST,(req,res) => {
  console.log(`Server is running ${HOST} on port ${PORT}`);
});
