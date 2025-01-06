import { Schema, model, Types } from "mongoose"

export const ReplySchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    repliedTo: {
        type: Types.ObjectId,
        required: true,
        refPath: 'repliedToModel'
    },
    repliedToModel: {
        type: String,
        required: true,
        enum: ['Ask', 'Reply']
    },
    useRef: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reply: {
        type: String,
        required: true
    },
    timeSpamp: {
        type: Date,
        default: Date.now
    },
    upvotes: [{
        type: Types.ObjectId,
        ref: 'User'
    }],

})
export const replyModel = model('Reply',ReplySchema)