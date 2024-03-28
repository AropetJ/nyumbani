import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for nested fields
interface RentalPreferences {
  budget?: number;
  preferredLocations?: string[];
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  amenities?: string[];
}

interface RentalHistory {
  property: mongoose.Types.ObjectId;
  feedback?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  pushNotifications: boolean;
}

interface ActivityHistory {
  activityType: string;
  details: string;
  timestamp?: Date;
}

// Define Property interface extending Document
interface Property extends Document {
  landlord: mongoose.Types.ObjectId;
  title: string;
  name: string;
  description?: string;
  location: string;
  price: number;
  images?: string[];
  rentalPreferences?: RentalPreferences;
  rentalHistory?: RentalHistory[];
  notificationSettings?: NotificationSettings;
  activityHistory?: ActivityHistory[];
  latitude?: number;
  longitude?: number;
}

// Define Property schema
const PropertySchema: Schema = new Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  rentalPreferences: {
    budget: { type: Number },
    preferredLocations: [{ type: String }],
    propertyType: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    furnished: { type: Boolean },
    amenities: [{ type: String }]
  },
  rentalHistory: [{
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    feedback: { type: String }
  }],
  notificationSettings: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true }
  },
  activityHistory: [{
    activityType: { type: String },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],

  // location
  latitude: { type: Number },
  longitude: { type: Number },
});

// Export the Property model
export const PropertyModel = mongoose.model<Property>('Property', PropertySchema);


// Property Actions
export const getProperties = (query?: Record<string, any>) => PropertyModel.find(query);
export const getPropertyByName = (name: string) => PropertyModel.findOne({ name });
export const getPropertyById = (id: string) => PropertyModel.findById(id);
export const createProperty = (values: Record<string, any>) => new PropertyModel(values).save().then((property) => property.toObject());
export const deletePropertyById = (id: string) => PropertyModel.findOneAndDelete({ _id: id });
export const updatePropertyById = async (id: string, values: Record<string, any>) => {
  try {
    const property = await PropertyModel.findByIdAndUpdate(id, values, { new: true });
    if (!property) {
      throw new Error('Property not found');
    }
    return property.toObject();
  } catch (error) {
    console.log(error);
    throw new Error('A server error occurred');
  }
};
// Path: server/src/db/properties.ts
