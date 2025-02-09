import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
const router = Router();

router.get("/",(req,res)=>{
    res.send("User Route")
})






export default router;