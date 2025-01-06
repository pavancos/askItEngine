import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Message, Room } from "./types";

const rooms: Record<string, Room> = {};

export const handleConnection = (ws: WebSocket, req: IncomingMessage) => {
  console.log("New WebSocket connection");

  ws.on("message", (message: string) => {
    try {
      const parsedMessage: Message = JSON.parse(message);
      switch (parsedMessage.type) {
        case "join":
          handleJoinRoom(ws, parsedMessage.roomId, parsedMessage.username!);
          break;
        case "message":
          handleChatMessage(parsedMessage.roomId, parsedMessage.username!, parsedMessage.message!);
          break;
        case "leave":
          handleLeaveRoom(ws, parsedMessage.roomId, parsedMessage.username!);
          break;
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

const handleJoinRoom = (ws: WebSocket, roomId: string, username: string) => {
  if (!rooms[roomId]) {
    rooms[roomId] = { clients: [] };
  }

  rooms[roomId].clients.push({ ws, username });
  console.log(`${username} joined room ${roomId}`);

  broadcastMessage(roomId, {
    type: "notification",
    message: `${username} has joined the room.`,
  });
};

const handleChatMessage = (roomId: string, username: string, message: string) => {
  console.log(`Message in room ${roomId} from ${username}: ${message}`);

  broadcastMessage(roomId, {
    type: "message",
    username,
    message,
  });
};

const handleLeaveRoom = (ws: WebSocket, roomId: string, username: string) => {
  if (rooms[roomId]) {
    rooms[roomId].clients = rooms[roomId].clients.filter((client) => client.ws !== ws);
    console.log(`${username} left room ${roomId}`);

    broadcastMessage(roomId, {
      type: "notification",
      message: `${username} has left the room.`,
    });

    if (rooms[roomId].clients.length === 0) {
      delete rooms[roomId];
    }
  }
};

const broadcastMessage = (roomId: string, message: any) => {
  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client)=>{
      client.ws.send(JSON.stringify(message));
    });
  }
};