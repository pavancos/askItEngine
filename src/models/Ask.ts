import { Schema, model, Types } from "mongoose";

export const AskSchema = new Schema({
    id: {
        type: Types.ObjectId,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    upvotes: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    replies:[{
        type: Types.ObjectId,
        ref: 'Reply'
    }],
    room:{
        type:Types.ObjectId,
        ref:'Room'
    }
})

export const askModel = model('Ask', AskSchema);