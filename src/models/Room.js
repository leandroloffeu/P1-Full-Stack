const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// const roomSchema = new mongoose.Schema({
//    id: { type: String, default: uuidv4 },
//    name: { type: String, required: true },
//    description: String,
//    capacity: { type: Number, required: true },
//    isActive: { type: Boolean, default: true },
//    createdAt: { type: Date, default: Date.now },
//});

const RoomSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    capacity: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    participants: [{
        userId: String,
        name: String
    }],
    messages: [{
        userId: String,
        name: String,
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Room', RoomSchema);

