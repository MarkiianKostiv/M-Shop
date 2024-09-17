# E-commerce API

## Description

This project is a REST API for an e-commerce platform. The API provides functionality for user registration, cart management, product management, coupons, and payment processing.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Stripe

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repository-url.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   PORT=your-backend-port
   ```

MONGO_URI=your-mongodb-uri

REDIS_DB_URL=your-redis-url

ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

STRIPE_SECRET_KEY=your-stripe-secret-key

CLIENT_URL=your-client-url

````

4. Start the server:

```bash
npm run dev
````

## API Routing

### 1. Authentication (Auth)

These routes provide user registration, login/logout, and token management.

| Method | Route           | Description          |
| ------ | --------------- | -------------------- |
| `POST` | `/auth/sign-up` | Register a new user  |
| `POST` | `/auth/login`   | User login           |
| `POST` | `/auth/logout`  | User logout          |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET`  | `/auth/profile` | Get user data        |

### 2. Cart

Routes for managing the user's shopping cart.

| Method   | Route           | Description                         |
| -------- | --------------- | ----------------------------------- |
| `POST`   | `/cart`         | Add a product to the cart           |
| `GET`    | `/cart`         | Retrieve cart products              |
| `DELETE` | `/cart/delete`  | Remove all products from the cart   |
| `PUT`    | `/cart/add/:id` | Update product quantity in the cart |

### 3. Products

Routes for managing products on the platform.

| Method   | Route                      | Description                        |
| -------- | -------------------------- | ---------------------------------- |
| `GET`    | `/product/`                | Get all products (admin only)      |
| `GET`    | `/product/featured`        | Get featured products              |
| `GET`    | `/product/recommendations` | Get recommended products           |
| `GET`    | `/product/category/:name`  | Get products by category           |
| `POST`   | `/product/add`             | Add a new product (admin only)     |
| `DELETE` | `/product/delete/:id`      | Delete a product (admin only)      |
| `PATCH`  | `/product/update/:id`      | Update product status (admin only) |

### 4. Coupons

Routes for managing coupons.

| Method | Route               | Description                     |
| ------ | ------------------- | ------------------------------- |
| `GET`  | `/coupons/`         | Get active coupons for the user |
| `POST` | `/coupons/validate` | Validate a coupon               |

### 5. Payments

Routes for handling payments via Stripe.

| Method | Route                              | Description               |
| ------ | ---------------------------------- | ------------------------- |
| `POST` | `/payment/create-checkout-session` | Create a checkout session |
| `POST` | `/payment/checkout-success`        | Handle successful payment |

### 6. Analytics

Routes for retrieving analytical data.

| Method | Route        | Description                                                |
| ------ | ------------ | ---------------------------------------------------------- |
| `GET`  | `/analytics` | Get general analytics (users count, products count, sales) |

## Security Requirements

To access protected routes, a JWT token is required. Include the `Authorization` header with the token in the following format:

```
Authorization: Bearer <your-token>
```

## Project Structure

- `/controllers` — Controllers handling request logic
- `/middleware` — Middleware for authentication and authorization
- `/models` — Mongoose models for MongoDB
- `/routes` — API route definitions
- `/schemas` — Data validation schemas

## License

This project is licensed under the MIT License. For more information, see the [LICENSE](LICENSE) file.
