import express from 'express';
import { get } from 'lodash';

import { getProperties, getPropertyById, getPropertyByName, createProperty, updatePropertyById, deletePropertyById } from '../db/properties';

/**
 * Creates a new property.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns The creates a new property object.
 */
export const registerProperty = async (req: express.Request, res: express.Response) => {
  try {
    // Obtain user ID from the request object or session
    const userId = get(req, 'identity._id') as string;

    if (!userId) {
      return res.status(400).json({ message: 'Unauthorized, Please log in' });
    }

    const { name, location, images, description, price } = req.body;

    // TODO: Add geocodeAddress function to get latitude and longitude

    const landlord = userId;

    // Create property document
    const property = await createProperty({
      name,
      landlord, // Assign user ID as landlord
      location,
      images,
      description,
      price
    });

    res.status(200).json(property);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}

/**
 * Retrieves all properties.
 * 
 * @param req - The express request object.
 * @param res - The express response object.
 * @returns A JSON response with all properties or an error message.
 */
export const getAllProperties = async (req: express.Request, res: express.Response) => {
  try {
    const properties = await getProperties();

    return res.status(200).json(properties);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
};

/**
 * Deletes a property by their ID.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the deleted property.
 */
export const deleteProperty = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const deletedProperty = await deletePropertyById(id);

    return res.json(deletedProperty);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

/**
 * Updates a property's name.
 * 
 * @param req - The request object containing the user ID and the new username.
 * @param res - The response object used to send the updated user object or an error message.
 * @returns A JSON response containing the updated property object or an error message.
 */
export const updateProperty = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Get all fields to update from request body

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Call the updatePropertyById function to update the user
    const updatedProperty = await updatePropertyById(id, updateFields);

    return res.status(200).json(updatedProperty);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

/**
 * Search properties based on the provided filters.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the properties that match the filters.
 */
export const searchProperties = async (req: express.Request, res: express.Response) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
      furnished,
      amenities
    } = req.query;

    let query: any = {};

    // Location filter
    if (typeof location === 'string') {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    // Price range filter
    if (minPrice !== undefined && maxPrice !== undefined) {
      query.price = { $gte: +minPrice, $lte: +maxPrice };
    } else if (minPrice !== undefined) {
      query.price = { $gte: +minPrice };
    } else if (maxPrice !== undefined) {
      query.price = { $lte: +maxPrice };
    }

    // Property type filter
    if (propertyType) {
      query['rentalPreferences.propertyType'] = propertyType;
    }

    // Bedrooms filter
    if (bedrooms) {
      query['rentalPreferences.bedrooms'] = +bedrooms;
    }

    // Bathrooms filter
    if (bathrooms) {
      query['rentalPreferences.bathrooms'] = +bathrooms;
    }

    // Furnished filter
    if (furnished !== undefined) {
      query['rentalPreferences.furnished'] = furnished === 'true';
    }

    // Amenities filter
    if (amenities) {
      query['rentalPreferences.amenities'] = { $all: amenities };
    }

    const properties = await getProperties(query);
    res.json(properties);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Path: server/src/controllers/properties.ts
