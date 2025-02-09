import { Router } from "express";
import dotenv from "dotenv";
import { generateJoinCode } from "../utils/roomUtils";
import { createRoomInDB, joinRoominDB, retrieveUserByEmail,retriveRoomById } from "../utils/dbutils";
dotenv.config();

const router = Router();

router.get("/", (req, res) => {
    res.send("Room Route")
})

// Create A Room
// Create a Ws room
// Add the room with its config to the db
// Return the unique Room Id

router.post("/create", async(req, res) => {
    const { roomTitle, roomDescription } = req.body;
    if(!roomTitle || !roomDescription){
        res.status(400).send({
            error:true,
            message: "Room Title and Room Description are required"
        });
        return;
    }
        
    try {
        if (!req.user || req.user === undefined) {
            res.status(401).send({
                error: true,
                message: "User not authenticated"
            });
            return;
        }
        const email = req.user?.emails[0]?.value;
        const user = await retrieveUserByEmail(email!);
        const roomCode = await generateJoinCode();
        if(roomCode.error){
            res.status(500).send({
                error:true,
                message: "Internal Server Error"
            });
            return;
        }
        const joinCode = roomCode.joinCode;
        const room = {
            title: roomTitle,
            description:roomDescription,
            joinCode,
            speaker: user?._id,
        }
        const newRoom = await createRoomInDB(room);
        res.status(200).send({
            error: false,
            message: "Room Created",
            joinCode: joinCode,
            room: newRoom
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: true,
            message: "Internal Server Error"
        })
    }
})



// Get All Rooms

// Join a Room by ID

router.put('/join/:joinCode', async(req,res)=>{
    const {joinCode} = req.params;
    if(!joinCode){
        res.status(400).send({
            error:true,
            message: "Join Code is required"
        });
        return;
    }
    try{
        if (!req.user || req.user === undefined) {
            res.status(401).send({
                error: true,
                message: "User not authenticated"
            });
            return;
        }
        const email = req.user?.emails[0]?.value;
        const user = await retrieveUserByEmail(email!);
        const joinedRoom = await joinRoominDB(user, joinCode);
        if(joinedRoom.error){
            res.status(400).send({
                error:true,
                message: joinedRoom.message
            });
            return;
        }
        res.status(200).send({
            error:false,
            message:"Room Joined",
            room: joinedRoom.room
        });
    }catch(err){
        console.log(err);
        res.status(500).send({
            error: true,
            message: "Internal Server Error"
        })
    }
})

// verify if the room is available & then join 


export default router;