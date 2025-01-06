import { Server as HTTPServer } from "http";
import { WebSocketServer } from "ws";
import { handleConnection } from "./wsHandlers";

export const initializeWebSocketServer = (server: HTTPServer) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", handleConnection);

  console.log("WebSocket server initialized");

  return wss;
};
