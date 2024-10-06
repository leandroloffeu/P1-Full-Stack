function setupSocket(io) {
    io.on('connection', (socket) => {
        console.log('Novo usuário conectado:', socket.id);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Usuário desconectado:', socket.id);
        });

        socket.on('signal', (roomId, signalData) => {
            socket.to(roomId).emit('signal', signalData);
        });
    });
}

module.exports = { setupSocket };
