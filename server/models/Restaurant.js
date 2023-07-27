const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    building: { type: String },
    coord: { type: [Number] },
    street: { type: String },
    zipcode: { type: String },
    city: { type: String },
    suburb: { type: String }
  },
  cuisine: { type: String },
  image: { type: String },
  schedule: { type: String },
  grades: [{
    date: { type: Date },
    score: { type: Number },
    comment: { type: String }
  }]
});

// Habilitar el índice de búsqueda de texto completo en los campos 'name', 'address.city' y 'cuisine'
restaurantSchema.index({ name: 'text', 'address.city': 'text', cuisine: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);