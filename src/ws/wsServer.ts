import { Server as HTTPServer } from "http";
import { WebSocketServer } from "ws";
import session from "express-session";
import { handleConnection } from "./wsHandlers";
import { jwtTokenVerification } from "../utils/authutils";
import { JwtPayload } from "jsonwebtoken";
import { retrieveUserById } from "../utils/dbutils";

declare module "http" {
  interface IncomingMessage {
    session?: any;
    user?: any;
  }
}

export const initializeWebSocketServer = (server: HTTPServer) => {
  const wss = new WebSocketServer({ noServer: true });
  console.log("WebSocket server initializing..");

  wss.on("connection", handleConnection);

  server.on("upgrade", (req, socket, head) => {
    const urlParams = new URLSearchParams(req.url?.split("?")[1]);
    const token = urlParams.get("token");
    if(!token){
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    const decodedData = jwtTokenVerification(token);
    
    if(!decodedData){
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    let userID = (decodedData as JwtPayload).userID;
    const fromDB= retrieveUserById(userID);
    if(!fromDB){
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    } 
    req.user = fromDB;
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  console.log("WebSocket server initialized");
  return wss;
};