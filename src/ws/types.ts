import { WebSocket } from "ws";

export type Message = {
    type: "join" | "message" | "leave" | "notification" | "upvote" | "downvote";
    roomId: string;
    username?: string;
    message?: string;
};

export type Room = {
    clients: {
        ws: WebSocket;
        username: string
    }[];
};
