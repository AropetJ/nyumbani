const mongoose = require('mongoose');

/**
 * Represents the schema for a property.
 *
 * @typedef {Object} PropertySchema
 * @property {string} title - The title of the property.
 * @property {string} description - The description of the property.
 * @property {Object} location - The location of the property.
 * @property {string} location.address - The address of the property.
 * @property {string} location.city - The city of the property.
 * @property {string} location.suburb - The suburb of the property.
 * @property {string} location.country - The country of the property.
 * @property {string} location.postalCode - The postal code of the property.
 * @property {string} type - The type of the property (e.g., apartment, house, condo).
 * @property {number} bedrooms - The number of bedrooms in the property.
 * @property {number} bathrooms - The number of bathrooms in the property.
 * @property {number} area - The area of the property in square feet/meters.
 * @property {boolean} furnished - Indicates if the property is furnished.
 * @property {string[]} amenities - The amenities available in the property.
 * @property {number} price - The price of the property.
 * @property {Date} availableFrom - The date the property is available from.
 * @property {Date} availableTo - The date the property is available to.
 * @property {string[]} images - The URLs of the property images.
 * @property {mongoose.Schema.Types.ObjectId} owner - The ID of the owner of the property.
 * @property {Object[]} rentalHistory - The rental history of the property.
 * @property {mongoose.Schema.Types.ObjectId} rentalHistory.tenant - The ID of the tenant.
 * @property {Date} rentalHistory.startDate - The start date of the rental period.
 * @property {Date} rentalHistory.endDate - The end date of the rental period.
 * @property {string} rentalHistory.feedback - The feedback from the tenant.
 */
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
// Path: models/property.js
