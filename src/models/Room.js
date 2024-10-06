const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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
        sender: String,  // Nome do usuário que enviou a mensagem
        message: String,  // Texto da mensagem
        timestamp: { type: Date, default: Date.now }  // Data e hora da mensagem
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', RoomSchema);





