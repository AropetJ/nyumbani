import mongoose from 'mongoose';

// User Config
const UserSchema = new mongoose.Schema({
  firstName: {type: String},
  lastName: {type: String},
  email: { type: String, required: true },
  username: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  profilePicture: {type: String},
  dateOfBirth: {type: Date},
  gender: {type: String, enum: ['Male', 'Female', 'Other']},
  nationality: {type: String},
  occupation: {type: String},
  bio: {type: String},
  address: {type: String},
  city: {type: String},
  country: {type: String},
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
  
  // Verification
  identityVerification: { type: Boolean, default: false },
  socialMediaLinks: { type: [String] },
  employmentVerification: { type: Boolean, default: false },
  resetPasswordToken:{ type: String},
  resetPasswordExpires:{ type: String},
  emailVerificationToken:{ type: String},
  emailVerificationExpires:{ type: String},

  // Financial Information
  paymentMethod: { type: String },
  billingAddress: { type: String },
  
  // Communication Preferences
  notificationSettings: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true }
  },
  languagePreferences: { type: String },
  
  // Legal Agreements
  termsAgreed: { type: Boolean, default: false },
  privacyPolicyAgreed: { type: Boolean, default: false },
  rentalAgreementAccepted: { type: Boolean, default: false },
  
  // Activity History
  activityHistory: [{
    activityType: { type: String },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Security
  twoFactorAuthenticationEnabled: { type: Boolean, default: false },
  
  // Admin/Staff Role
  isAdmin: { type: Boolean, default: false }
});

export const UserModel = mongoose.model('User', UserSchema);

// User Actions
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByPasswordResetToken = (resetPasswordToken: string) => UserModel.findOne({ resetPasswordToken: resetPasswordToken });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
