const express = require('express');
const router = express.Router();
const { register, login, addUser, deleteUser, updateUser, getUsers } = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Registro de usuario (sin autenticación)
router.post('/register', register);

// Inicio de sesión
router.post('/login', login);


// Route to get all users (admin only)
router.get('/usuarios', authMiddleware, adminMiddleware, getUsers);
// Rutas protegidas (solo para administradores)
router.post('/addUser', authMiddleware, adminMiddleware, addUser);
router.delete('/deleteUser/:id', authMiddleware, adminMiddleware, deleteUser);
router.put('/updateUser/:id', authMiddleware, adminMiddleware, updateUser);

module.exports = router;
