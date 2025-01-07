import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.get("/",(req,res)=>{
    res.send("Room Route")
})

// Create A Room
    // Create a Ws room
    // Add the room with its config to the db
    // Return the unique Room Id

// Get All Rooms
    
// Get Room By ID
    
// Join a Room by ID
    // verify if the room is available & then join 
    

export default router;