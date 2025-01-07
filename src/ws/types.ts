import { WebSocket } from "ws";

export type Message = {
    type: "create" |"join" | "message" | "leave" | "notification" | "upvote" | "downvote";
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
export type XRoom = {
    creator:{
        ws: WebSocket;
        username: string
    };
    clients: {
        ws: WebSocket;
        username: string
    }[];
};