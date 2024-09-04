const User = require('../models/modelUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario (solo administradores)
const register = async (req, res) => {
    const { username, password, role, fullName, phone, email } = req.body;

    try {
        // Verificar si el rol es válido
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Verificar si el usuario ya existe
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Crear un nuevo usuario
        user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            role,
            fullName,
            phone,
            email
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Inicio de sesión (permitido para todos los usuarios)
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Crear un token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const addUser = async (req, res) => {
    const { username, password, role, fullName, phone, email } = req.body;

    try {
        // Verificar si el usuario tiene rol de administrador
        const adminUser = await User.findById(req.user.id);
        if (adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Verificar si el rol es válido
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Verificar si el usuario ya existe
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Crear un nuevo usuario
        user = new User({
            username,
            password: await bcrypt.hash(password, 10),
            role,
            fullName,
            phone,
            email
        });

        await user.save();

        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Eliminar usuario (solo admin)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el usuario tiene rol de administrador
        const adminUser = await User.findById(req.user.id);
        if (adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Eliminar el usuario
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Actualizar usuario (solo admin)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    try {
        // Verificar si el usuario tiene rol de administrador
        const adminUser = await User.findById(req.user.id);
        if (adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Actualizar el usuario
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role && ['admin', 'user'].includes(role)) user.role = role;

        await user.save();

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all users (admin only)
const getUsers = async (req, res) => {
    try {
      // Verify if the user has an admin role
      const adminUser = await User.findById(req.user.id);
      if (adminUser.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Fetch all users
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

module.exports = {
    register,
    login,
    addUser,
    deleteUser,
    updateUser,
    getUsers
};
