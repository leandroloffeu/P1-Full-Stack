const express = require('express');
const AuthService = require('../services/authService');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');



// Cadastro
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const token = await AuthService.register(name, email, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await AuthService.login(email, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Excluir um usuário (somente usuário autenticado ou administrador)
router.delete('/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params;

    try {
        // Verificar se o usuário existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verificação opcional: somente o próprio usuário ou administrador pode excluir
        // Assumindo que req.user.id é o ID do usuário autenticado e req.user.role indica o papel
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Você não tem permissão para excluir este usuário' });
        }

        // Excluir o usuário do banco de dados
        await User.deleteOne({ _id: userId });

        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir o usuário' });
    }
});

// Rota para listar todos os usuários (apenas para administradores)
router.get('/', authMiddleware, async (req, res) => {
    try {
        

        // Buscar todos os usuários cadastrados
        const users = await User.find({}, '-password'); // Omitindo o campo "password"
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar os usuários.' });
    }
});




module.exports = router;
