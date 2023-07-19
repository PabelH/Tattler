const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Analizador de cuerpo JSON
app.use(express.urlencoded({ extended: false })); // Analizador de cuerpo URL-encoded
app.use(cors());

// Conexión a la base de datos
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

// Rutas
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Puerto de escucha
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Servidor en ejecución en el puerto ${port}`));
