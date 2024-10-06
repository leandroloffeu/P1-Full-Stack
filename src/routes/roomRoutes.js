const express = require('express');
const Room = require('../models/Room');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');


// Criar nova sala
router.post('/', async (req, res) => {
    try {
        const { name, description, capacity } = req.body;
        const room = new Room({ name, description, capacity });
        await room.save();
        res.json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todas as salas
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Participar de uma sala
router.post('/join', authMiddleware, async (req, res) => {
    const { roomId } = req.body;
    const userId = req.user.id;  // Obter o ID do usuário logado (do token JWT)
    const name = req.user.name;  // Nome do usuário logado (do token JWT)

    try {
        const room = await Room.findOne({ id: roomId });
        if (!room || !room.isActive) {
            return res.status(404).json({ error: 'Sala não encontrada ou inativa' });
        }

        // Verifique se o usuário já está na lista de participantes
        const isAlreadyInRoom = room.participants.some(participant => participant.userId === userId);
        if (isAlreadyInRoom) {
            return res.status(400).json({ error: 'Usuário já está na sala' });
        }

        // Adicionar o usuário à lista de participantes
        room.participants.push({ userId, name });
        await room.save();

        res.json({ message: 'Você entrou na sala', participants: room.participants });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar participantes de uma sala
router.get('/:roomId/participants', authMiddleware, async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await Room.findOne({ id: roomId });
        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        res.json(room.participants);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remover participante de uma sala
router.delete('/:roomId/participants', authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;  // ID do participante a ser removido

    try {
        // Buscar a sala com o roomId fornecido
        const room = await Room.findOne({ id: roomId });
        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        // Verificar se o participante existe na sala
        const participantIndex = room.participants.findIndex(participant => participant.userId === userId);
        if (participantIndex === -1) {
            return res.status(404).json({ error: 'Participante não encontrado na sala' });
        }

        // Remover o participante do array
        room.participants.splice(participantIndex, 1);
        await room.save();

        res.json({ message: 'Participante removido com sucesso', participants: room.participants });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Excluir uma sala
router.delete('/:roomId', authMiddleware, async (req, res) => {
    const { roomId } = req.params;

    try {
        // Verificar se a sala existe
        const room = await Room.findOne({ id: roomId });
        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        // Excluir a sala do banco de dados
        await Room.deleteOne({ id: roomId });

        res.json({ message: 'Sala excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir a sala' });
    }
});


// Listar todas as mensagens de uma sala
router.get('/:roomId/messages', authMiddleware, async (req, res) => {
    const { roomId } = req.params;

    try {
        // Buscar a sala e as mensagens associadas a ela
        const room = await Room.findOne({ id: roomId });
        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        res.json(room.messages);  // Retornar as mensagens da sala
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Enviar uma mensagem para a sala
router.post('/:roomId/messages', authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;  // Pega o ID do usuário autenticado
    const userName = req.user.name;  // Pega o nome do usuário autenticado

    try {
        // Buscar a sala com o roomId fornecido
        const room = await Room.findOne({ id: roomId });

        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        // Adicionar a mensagem à lista de mensagens da sala
        room.messages.push({
            sender: userName,
            message,
            timestamp: new Date()
        });

        await room.save();

        // Enviar a mensagem para todos os clientes conectados à sala via WebSocket
        req.app.get('io').to(roomId).emit('newMessage', {
            sender: userName,
            message,
            timestamp: new Date()
        });

        res.json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
});

// Listar todas as mensagens de uma sala
router.get('/:roomId/messages', authMiddleware, async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await Room.findOne({ id: roomId });

        if (!room) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        res.json(room.messages);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar mensagens' });
    }
});

module.exports = router;





