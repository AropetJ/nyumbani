const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Property = require('../models/property');

const { expect } = chai;

describe('Property Model', () => {
  beforeEach(() => {
    sinon.restore();
  });

  it('should create a new property', () => {
    const propertyData = {
      title: 'Test Property',
      description: 'This is a test property',
      location: {
        address: '123 Test Street',
        city: 'Test City',
        suburb: 'Test Suburb',
        country: 'Test Country',
        postalCode: '12345'
      },
      type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 1000,
      furnished: true,
      amenities: ['parking', 'gym'],
      price: 1000,
      availableFrom: new Date(),
      availableTo: new Date(),
      images: ['image1.jpg', 'image2.jpg'],
      owner: mongoose.Types.ObjectId(),
      rentalHistory: []
    };

    const property = new Property(propertyData);

    expect(property.title).to.equal(propertyData.title);
    expect(property.description).to.equal(propertyData.description);
    expect(property.location).to.deep.equal(propertyData.location);
    expect(property.type).to.equal(propertyData.type);
    expect(property.bedrooms).to.equal(propertyData.bedrooms);
    expect(property.bathrooms).to.equal(propertyData.bathrooms);
    expect(property.area).to.equal(propertyData.area);
    expect(property.furnished).to.equal(propertyData.furnished);
    expect(property.amenities).to.deep.equal(propertyData.amenities);
    expect(property.price).to.equal(propertyData.price);
    expect(property.availableFrom).to.equal(propertyData.availableFrom);
    expect(property.availableTo).to.equal(propertyData.availableTo);
    expect(property.images).to.deep.equal(propertyData.images);
    expect(property.owner).to.equal(propertyData.owner);
    expect(property.rentalHistory).to.deep.equal(propertyData.rentalHistory);
  });
});