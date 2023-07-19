const Restaurant = require('../models/Restaurant');

// Obtener todos los restaurantes
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los restaurantes' });
  }
};

// Obtener un restaurante por ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el restaurante' });
  }
};

// Agregar un nuevo restaurante
const addRestaurant = async (req, res) => {
  try {
    const { name, cuisine, schedule } = req.body;
    const restaurant = new Restaurant({ name, cuisine, schedule });
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el restaurante' });
  }
};

// Actualizar un restaurante por ID
const updateRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el restaurante' });
  }
};

// Eliminar un restaurante por ID
const deleteRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndRemove(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json({ message: 'Restaurante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el restaurante' });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  addRestaurant,
  updateRestaurantById,
  deleteRestaurantById
};