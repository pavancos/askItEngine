import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Message,Room,Attendee } from "./types";
import { generateJoinCode, generateRandomEmoji } from "./wsUtils/joinUtils";
import { retrieveUserById,createRoomInDB } from "../utils/dbutils";
import { title } from "process";


const rooms: Record<string, Room> = {};


export const handleConnection = (ws: WebSocket, req: IncomingMessage) => {
  console.log("New WebSocket connection");
  
  ws.send(JSON.stringify({ type: "notification", message: "Connected to server" }));


  setTimeout(()=>{
    console.log(rooms)
  },2000);

  ws.on("message", (message: string) => {
    try {
      const parsedMessage: Message = JSON.parse(message);
      switch (parsedMessage.type) {
        case "create":
          handleCreateRoom(ws, parsedMessage);
        case "join":
        default:
          console.error("Unknown message type");
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

const handleCreateRoom = async (ws:WebSocket,message:Message) =>{
  const joinCode = generateJoinCode();
  // validate user
  const user = await retrieveUserById(message.payload.userId);
  if(!user){
    ws.send(
      JSON.stringify({
        "type":"error",
        "payload":{
          "message":"SignIn to Create Room"
        }
      })
    )
    return;
  }
  const newRoom = {
    joinCode,
    title: message.payload.title,
    description: message.payload.desc,
    speaker: user._id,
  }
  createRoomInDB(newRoom) 
  rooms[joinCode] = {
    joinCode,
    title: message.payload.title,
    creator: {
      id: user.userId as string,
      name: user.name as string,
      socket: ws,
    },
    attendees: [],
  };
  ws.send(
    JSON.stringify({
      type: "roomCreated",
      payload: {
        joinCode,
        title: message.payload.title,
        desc: message.payload.desc
      },
    })
  );
}

const handleJoinRoom = async (ws:WebSocket,message:Message) =>{
  const joinCode = message.payload.joinCode;
  const room = rooms[joinCode];
  if(!room){
    ws.send(
      JSON.stringify({
        "type":"error",
        "payload":{
          "message":"Room is Not Active or Doesnot Exist"
        }
      })
    )
    return;
  }
  const user = await retrieveUserById(message.payload.userId);
  if(!user){
    ws.send(
      JSON.stringify({
        "type":"error",
        "payload":{
          "message":"SignIn to Join Room"
        }
      })
    )
    return;
  }
  const attendee: Attendee = {
    id: user.userId as string,
    emoji: generateRandomEmoji(),
    socket: ws,
  };
  room.attendees.push(attendee);
  room.creator.socket.send(
    JSON.stringify({
      type: "attendeeNotify",
      payload: {
        attendees: room.attendees.length,
      },
    })
  );
}


// const broadcastMessage = (roomId: string, message: any) => {
//   if (rooms[roomId]) {
//     rooms[roomId].clients.forEach((client)=>{
//       client.ws.send(JSON.stringify(message));
//     });
//   }
// };

// const broadcastMessage = (roomId: string, message: any) => {
//   if (rooms[roomId]) {
//     rooms[roomId].clients.forEach((client) => {
//       client.ws.send(
//         JSON.stringify({
//           ...message,
//           sender: "anonymous",
//         })
//       );
//     });
//   }
// };
