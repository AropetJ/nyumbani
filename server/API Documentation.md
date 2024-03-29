# Nyumbani API Documentation

## Introduction:
The Nyumbani API provides endpoints for managing properties, users, authentication, and other functionalities for the Nyumbni application.

## Authentication:
Endpoints requiring authentication are secured using sessionTokens. To authenticate, include the  sessionToken in the `Authorization` header of the HTTP request.

```http
Authorization: Bearer <SEESION_TOKEN>
```

### Endpoints:

1. #### User Registration

- Endpoint: `POST /auth/register`

This HTTP POST request is used to register a new user for authentication. The request should include a JSON payload in the raw request body type with the keys "username", "email", and "password".

##### Request Body

- `username`: (string) The username of the user to be registered.
- `email`: (string) The email address of the user to be registered.
- `password`: (string) The password for the user account.
    

The response to this request will be in JSON format with a 200 status code. It includes various user details and settings, such as email, username, authentication details, rental preferences, identity verification status, social media links, employment verification status, email verification status, notification settings, terms agreed status, privacy policy agreed status, rental agreement acceptance status, two-factor authentication status, admin status, user ID, rental history, and activity history.

#### Response Body

- `email`: (string) The email address of the registered user.
- `username`: (string) The username of the registered user.
- `authentication`: (object) Object containing password and salt for authentication.
- `rentalPreferences`: (object) Object containing preferred locations and amenities for rentals.
- `identityVerification`: (boolean) Indicates the status of identity verification.
- `socialMediaLinks`: (array) Array of social media links associated with the user.
- `employmentVerification`: (boolean) Indicates the status of employment verification.
- `emailVerified`: (boolean) Indicates if the email is verified.
- `notificationSettings`: (object) Object containing email, SMS, and push notification settings.
- `termsAgreed`: (boolean) Indicates if the user has agreed to the terms.
- `privacyPolicyAgreed`: (boolean) Indicates if the user has agreed to the privacy policy.
- `rentalAgreementAccepted`: (boolean) Indicates if the user has accepted the rental agreement.
- `twoFactorAuthenticationEnabled`: (boolean) Indicates if two-factor authentication is enabled for the user.
- `isAdmin`: (boolean) Indicates if the user has admin privileges.
- `_id`: (string) The unique ID of the registered user.
- `rentalHistory`: (array) Array containing the user's rental history.
- `activityHistory`: (array) Array containing the user's activity history.
- `__v`: (number) Version number of the user data.
       
2. #### User Login

- Endpoint: `POST /auth/login`

This API endpoint is used to authenticate a user by providing their email and password.

##### Request Body

- email (text, required): The email address of the user.
- password (text, required): The password of the user.
    

##### Response

- Status: 200
- Content-Type: application/json
    

``` json
{
    "authentication": {
        "password": "",
        "salt": "",
        "sessionToken": ""
    },
    "rentalPreferences": {
        "preferredLocations": [],
        "amenities": []
    },
    "notificationSettings": {
        "email": true,
        "sms": true,
        "pushNotifications": true
    },
    "_id": "",
    "email": "",
    "username": "",
    "identityVerification": true,
    "socialMediaLinks": [],
    "employmentVerification": true,
    "emailVerified": true,
    "termsAgreed": true,
    "privacyPolicyAgreed": true,
    "rentalAgreementAccepted": true,
    "twoFactorAuthenticationEnabled": true,
    "isAdmin": true,
    "rentalHistory": [],
    "activityHistory": [],
    "__v": 0
}

 ```
   
2. **Properties Management**

   - **Get All Properties**
   
     - Endpoint: `GET /properties`
     - Description: Retrieve all properties.
     - Response:
       - Status: `200 OK`
       - Body: Array of property objects.

   - **Get Property by ID**
   
     - Endpoint: `GET /properties/:id`
     - Description: Retrieve a specific property by ID.
     - Response:
       - Status: `200 OK`
       - Body: Property object.

   - **Create Property**
   
     - Endpoint: `POST /properties`
     - Description: Create a new property.
     - Request Body:
       ```json
       {
           "title": "Property Title",
           "description": "Property Description",
           "price": 1000,
           "location": "Property Location"
       }
       ```
     - Response:
       - Status: `201 Created`
       - Body: Newly created property object.
   
   - **Update Property**
   
     - Endpoint: `PATCH /properties/:id`
     - Description: Update an existing property.
     - Request Body: Fields to update.
     - Response:
       - Status: `200 OK`
       - Body: Updated property object.
   
   - **Delete Property**
   
     - Endpoint: `DELETE /properties/:id`
     - Description: Delete a property by ID.
     - Response:
       - Status: `204 No Content`

**Error Handling:**
- Errors are returned with appropriate HTTP status codes and JSON response bodies containing error messages.

**Rate Limiting:**
- Certain endpoints may have rate limiting to prevent abuse, like the login end point.

**Conclusion:**
This documentation provides an overview of the Nyumbani API endpoints for user authentication and property management. Developers can use this information to integrate Bulocker functionalities into their applications.