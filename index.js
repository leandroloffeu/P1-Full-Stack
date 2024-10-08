require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./src/routes/userRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const { setupSocket } = require('./src/sockets/socket');
const authMiddleware = require('./src/middlewares/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');




// Iniciando o app Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB', err));

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/rooms', authMiddleware, roomRoutes);

// Salvando o objeto `io` no app para usar em rotas
app.set('io', io);

// Configuração do Socket.io
io.on('connection', (socket) => {
    console.log('Usuário conectado via WebSocket');

    // Entrar em uma sala de chat específica
    socket.on('joinRoom', ({ roomId, userName }) => {
        socket.join(roomId);
        console.log(`${userName} entrou na sala ${roomId}`);
        io.to(roomId).emit('message', `${userName} entrou na sala.`);
    });

    // Receber e transmitir mensagens de chat
    socket.on('chatMessage', ({ roomId, message, userName }) => {
        io.to(roomId).emit('message', `${userName}: ${message}`);
    });

    // Desconectar
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Configuração do Socket.io
// setupSocket(io);

// Conexão WebSocket
io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // Entrar em uma sala de chat específica
  socket.on('joinRoom', ({ roomId, userName }) => {
      socket.join(roomId);
      io.to(roomId).emit('message', `${userName} entrou na sala.`);
  });

  /// Entrar em uma sala de chat específica
  socket.on('joinRoom', async ({ roomId, userName }) => {
    socket.join(roomId);
    io.to(roomId).emit('message', `${userName} entrou na sala.`);
});

// Receber e transmitir mensagens de chat
socket.on('chatClient', async ({ roomId, message, userName }) => {
    // Salvar a mensagem no banco de dados
    const room = await Room.findOne({ id: roomId });
    if (room) {
        room.messages.push({ userName, message });
        await room.save();
    }

    // Transmitir a mensagem para todos na sala
    io.to(roomId).emit('message', `${userName}: ${message}`);
});

  // Desconectar
  socket.on('disconnect', () => {
      console.log('Usuário desconectado');
  });
});


// Carregar o arquivo swagger.yaml
const swaggerDocument = yaml.load('./swagger.yaml');


// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Iniciar o servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


