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
  description?: string;
  location: string;
  price: number;
  images?: string[];
  rentalPreferences?: RentalPreferences;
  rentalHistory?: RentalHistory[];
  notificationSettings?: NotificationSettings;
  activityHistory?: ActivityHistory[];
}

// Define Property schema
const PropertySchema: Schema = new Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
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
});

// Export the Property model
export const PropertyModel = mongoose.model<Property>('Property', PropertySchema);


// User Actions
export const getProperties = () => PropertyModel.find();
export const getUserByEmail = (email: string) => PropertyModel.findOne({ email });
export const getUserByPasswordResetToken = (resetPasswordToken: string) => PropertyModel.findOne({ resetPasswordToken: resetPasswordToken });
export const getUserByEmailVerificationToken = (emailVerificationToken: string) => PropertyModel.findOne({ emailVerificationToken: emailVerificationToken });
export const getUserBySessionToken = (sessionToken: string) => PropertyModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => PropertyModel.findById(id);
export const createUser = (values: Record<string, any>) => new PropertyModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => PropertyModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => PropertyModel.findByIdAndUpdate(id, values);
// Path: server/src/db/properties.ts
