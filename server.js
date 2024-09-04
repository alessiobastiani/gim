// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();
// Ahora puedes acceder a las variables de entorno usando process.env
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const passport = require('passport'); // Importa passport aquí
require('./config/Passport'); // Importa la configuración de Passport


const app = express();
app.use(cors());
app.use(express.json());

app.use(passport.initialize()); // Inicia Passport


// Conectar a MongoDB usando la variable de entorno MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Rutas para gestión de usuarios
app.use('/api/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
