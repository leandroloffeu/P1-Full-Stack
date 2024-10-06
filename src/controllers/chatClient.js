const io = require('socket.io-client');

// Conectar ao servidor Socket.io
const socket = io('http://localhost:5000');

// Quando conectar ao servidor
socket.on('connect', () => {
    console.log('Conectado ao servidor');

    // Entrar na sala de chat
    const roomId = '3ba4a0e8-84d3-45eb-963a-23fd3044c5ee';  // ID da sala
    const userName = 'Leandro';  // Nome do usuário
    const userId = '6701927e1cbd5e97b4a44b';  // ID do usuário (deve ser único)

    // Emitir evento para entrar na sala
    socket.emit('joinRoom', { roomId, userName });

    // Enviar uma mensagem
    const message = 'Olá, pessoal!';
    socket.emit('chatMessage', { roomId, message, userName, userId });
});

// Receber mensagens do servidor
socket.on('message', (data) => {
    console.log('Mensagem recebida: ', data);
});
