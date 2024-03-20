const mongoose = require('mongoose');
require('dotenv').config();

const dbURL = process.env.MONGODB_URL;

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
);

const userSchema = new mongoose.Schema({
  firstName: {type: String},
  lastName: {type: String},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
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

module.exports = mongoose.model('User', userSchema);
