const express = require('express');
const router = express.Router();
const restaurantCont = require('../controllers/restaurantCont');

// Ruta para obtener todos los restaurantes
router.get('/restaurants', restaurantCont.getAllRestaurants);

// Ruta para obtener un restaurante por ID
router.get('/restaurants/:id', restaurantCont.getRestaurantById);

// Ruta para agregar un nuevo restaurante
router.post('/restaurants', restaurantCont.addRestaurant);

// Ruta para actualizar un restaurante por ID
router.patch('/restaurants/:id', restaurantCont.updateRestaurantById);

// Ruta para eliminar un restaurante por ID
router.delete('/restaurants/:id', restaurantCont.deleteRestaurantById);

module.exports = router;