import { WebSocket } from "ws";

export type Attendee = {
    id:string;
    emoji:string;
    socket: WebSocket
}

export type Room = {
    joinCode: string;
    title:string;
    desc?:string;
    creator:{
        id:string;
        name:string;
        socket:WebSocket;
    }
    attendees: Array<Attendee>;    
};

export type Message = {
    type : "create" | "join" | "error" | "roomCreated" | "attendeeNotify" | "ask" | "askNotify" | "upvote" | "upvoteNotify" | "leaveRoom" | "leaveRoomNotify" | "endRoom" | "endRoomNotify" | "markAsAnswered" | "markAsAnsweredNotify"
    payload:any;
}