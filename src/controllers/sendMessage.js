const io = require('socket.io-client');
const axios = require('axios');

const socket = io('http://localhost:5000');

// Função para autenticar e obter o token JWT
async function authenticate(username, password) {
    try {
        const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
        return response.data.token;  // Retorna o token JWT
    } catch (error) {
        console.error('Erro na autenticação:', error.message);
        throw error;
    }
}

// Função para enviar a mensagem
function sendMessage(roomId, message, userName, token) {
    socket.emit('chatMessage', { roomId, message, userName, token });
}

// Função para entrar na sala
function joinRoom(roomId, userName) {
    socket.emit('joinRoom', { roomId, userName });
    console.log(`${userName} entrou na sala: ${roomId}`);
}

// Evento para exibir as mensagens recebidas
socket.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
});

// Função principal
async function main() {
    const username = 'Leandro';
    const password = 'sua_senha';

    // Autenticação para obter o token
    const token = await authenticate(username, password);

    // ID da sala e nome do usuário
    const roomId = '12345';
    const userName = 'Leandro';

    // Entrar na sala
    joinRoom(roomId, userName);

    // Enviar a mensagem depois de 2 segundos
    setTimeout(() => {
        const message = 'mensagem de teste!';
        sendMessage(roomId, message, userName, token);
        console.log(`Mensagem enviada: ${message}`);
    }, 2000);
}

// Executa o script
main();
