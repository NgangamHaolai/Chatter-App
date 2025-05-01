import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    From: { type: String, required: true },
    senderID: { type: mongoose.Schema.Types.ObjectId, ref: 'userData'},
    To: { type: String, required: true },
    receiverID: { type: mongoose.Schema.Types.ObjectId, ref: 'userData' },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    localTime: { type: String },
    localDate: { type: String },
});

export default mongoose.model('messageData', messageSchema);