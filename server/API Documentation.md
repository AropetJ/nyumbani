**BNyumbani API Documentation**

**Introduction:**
The Nyumbani API provides endpoints for managing properties, users, authentication, and other functionalities for the Nyumbni application.

**Authentication:**
Endpoints requiring authentication are secured using sessionTokens. To authenticate, include the  sessionToken in the `Authorization` header of the HTTP request.

```http
Authorization: Bearer <SEESION_TOKEN>
```

**Endpoints:**

1. **User Authentication**

   - **Register User**
   
     - Endpoint: `POST /auth/register`
     - Description: Register a new user.
     - Request Body:
       ```json
       {
           "email": "nyumbani@gmail.com",
           "password": "password123",
           "username": "nyumbani"
       }
       ```
     - Response:
       - Status: `201 Created`
       - Body:
         ```json
         {
             "id": "user_id",
             "email": "nyumbani@gmail.com",
             "username": "nyumbani"
         }
         ```
       
   - **User Login**
   
     - Endpoint: `POST /auth/login`
     - Description: Log in existing user.
     - Request Body:
       ```json
       {
           "email": "nyumbani@gmail.com",
           "password": "password123"
       }
       ```
     - Response:
       - Status: `200 OK`
       - Body:
         ```json
         {
             "id": "user_id",
             "email": "nyumbani@gmail.com",
             "username": "nyumbani",
             "token": "<SEESION_TOKEN>"
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