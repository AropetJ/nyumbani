const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    suburb: { type: String },
    country: { type: String, required: true },
    postalCode: { type: String }
  },
  type: { type: String, required: true }, // e.g., apartment, house, condo
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number }, // Area in square feet/meters
  furnished: { type: Boolean, default: false },
  amenities: [{ type: String }], // e.g., parking, gym, pool
  price: { type: Number, required: true },
  availableFrom: { type: Date },
  availableTo: { type: Date },
  images: [{ type: String }], // URLs of property images
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Rental history to keep track of previous tenants and their feedback
  rentalHistory: [{
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date },
    endDate: { type: Date },
    feedback: { type: String }
  }]
});

module.exports = mongoose.model('Property', propertySchema);
