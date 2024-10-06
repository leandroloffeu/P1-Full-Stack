const axios = require('axios');

// Função para listar as mensagens de uma sala
async function listMessages(roomId) {
    try {
        // Fazer uma solicitação GET para buscar as mensagens
        const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}/messages`, {
            headers: {
                'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDE5MjYyMWNiZDVlOTdiNGE0NGIyMCIsImVtYWlsIjoibGVhbmRybzEwQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI4MjQwNTA5LCJleHAiOjE3MjgyNDQxMDl9.copk5c4cpSx6V6il_V3ttgnAtL0y6yWjMtBwct2h5lg`  // Enviar token de autenticação
            }
        });

        const messages = response.data;

        // Exibir as mensagens no console
        console.log(`Mensagens da sala ${roomId}:`);
        messages.forEach((msg, index) => {
            console.log(`${index + 1}. ${msg.userName}: ${msg.message} (Enviado em: ${new Date(msg.timestamp).toLocaleString()})`);
        });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error.response ? error.response.data : error.message);
    }
}

// ID da sala que deseja listar
const roomId = '4ce24018-77a1-4dd0-b824-303539de3549';
listMessages(roomId);
