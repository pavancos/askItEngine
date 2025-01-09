import { model, Schema, Types } from "mongoose";

export const RoomSchema = new Schema({
    joinCode: {
        type: String,
        require: true,
        unique: true
    },
    title:{
        type: String,
        require: true
    },
    description: {
        type: String
    },
    speaker: {
        type: Types.ObjectId,
        ref: "User"
    },

    attendees: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    asks: [
        {
            type: Types.ObjectId,
            ref: "Ask"
        }
    ]
});


export const roomModel = model("Room", RoomSchema);