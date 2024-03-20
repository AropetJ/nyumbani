const mongoose = require('mongoose');
require('dotenv').config();

const dbURL = process.env.MONGODB_URL;

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
);

/**
 * User Schema
 * @typedef {Object} UserSchema
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user. (required, unique)
 * @property {string} password - The password of the user. (required)
 * @property {string} profilePicture - The profile picture of the user.
 * @property {Date} dateOfBirth - The date of birth of the user.
 * @property {string} gender - The gender of the user. (enum: 'Male', 'Female', 'Other')
 * @property {string} nationality - The nationality of the user.
 * @property {string} occupation - The occupation of the user.
 * @property {string} bio - The biography of the user.
 * @property {string} address - The address of the user.
 * @property {string} city - The city of the user.
 * @property {string} country - The country of the user.
 * @property {Object} rentalPreferences - The rental preferences of the user.
 * @property {number} rentalPreferences.budget - The budget for rental.
 * @property {string[]} rentalPreferences.preferredLocations - The preferred locations for rental.
 * @property {string} rentalPreferences.propertyType - The preferred property type for rental.
 * @property {number} rentalPreferences.bedrooms - The preferred number of bedrooms for rental.
 * @property {number} rentalPreferences.bathrooms - The preferred number of bathrooms for rental.
 * @property {boolean} rentalPreferences.furnished - Indicates if the rental should be furnished.
 * @property {string[]} rentalPreferences.amenities - The preferred amenities for rental.
 * @property {Object[]} rentalHistory - The rental history of the user.
 * @property {mongoose.Schema.Types.ObjectId} rentalHistory.property - The property rented by the user.
 * @property {string} rentalHistory.feedback - The feedback for the rental.
 * @property {boolean} identityVerification - Indicates if the user's identity is verified. (default: false)
 * @property {string[]} socialMediaLinks - The social media links of the user.
 * @property {boolean} employmentVerification - Indicates if the user's employment is verified. (default: false)
 * @property {string} resetPasswordToken - The token for resetting the user's password.
 * @property {string} resetPasswordExpires - The expiration date for the reset password token.
 * @property {string} emailVerificationToken - The token for verifying the user's email.
 * @property {string} emailVerificationExpires - The expiration date for the email verification token.
 * @property {string} paymentMethod - The payment method of the user.
 * @property {string} billingAddress - The billing address of the user.
 * @property {Object} notificationSettings - The notification settings of the user.
 * @property {boolean} notificationSettings.email - Indicates if email notifications are enabled. (default: true)
 * @property {boolean} notificationSettings.sms - Indicates if SMS notifications are enabled. (default: false)
 * @property {boolean} notificationSettings.pushNotifications - Indicates if push notifications are enabled. (default: true)
 * @property {string} languagePreferences - The language preferences of the user.
 * @property {boolean} termsAgreed - Indicates if the user has agreed to the terms. (default: false)
 * @property {boolean} privacyPolicyAgreed - Indicates if the user has agreed to the privacy policy. (default: false)
 * @property {boolean} rentalAgreementAccepted - Indicates if the user has accepted the rental agreement. (default: false)
 * @property {Object[]} activityHistory - The activity history of the user.
 * @property {string} activityHistory.activityType - The type of activity.
 * @property {string} activityHistory.details - The details of the activity.
 * @property {Date} activityHistory.timestamp - The timestamp of the activity. (default: Date.now)
 * @property {boolean} twoFactorAuthenticationEnabled - Indicates if two-factor authentication is enabled. (default: false)
 * @property {boolean} isAdmin - Indicates if the user is an admin/staff. (default: false)
 */
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
// Path: models/user.js
