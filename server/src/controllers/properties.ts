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
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const property = await getPropertyById(id);
    
    property.name = name;
    await property.save();

    return res.status(200).json(property).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}
