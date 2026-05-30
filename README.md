# ShopSphere | Full-Stack E-Commerce Marketplace

ShopSphere is an enterprise-grade, full-stack e-commerce marketplace built using the MERN stack (React, Node.js, Express, MongoDB) with a premium SaaS-inspired responsive design, dark/light theme switching, JWT authentication, Stripe payment integrations, and administrative control panels.

---

## 🚀 Key Features

* **Client-Side SPA Architecture**: Built on Vite, React 18, Tailwind CSS, and React Router v6.
* **JWT Authentication & Authorization**: Roles for customer profiling and administrator access restrictions.
* **Product Catalog**: Live search, side filter layouts (by category, minimum ratings, pricing), and sorting.
* **Shopping Cart & Checkout**: Slide-out drawer cart, estimations, coupon codes (`WELCOME10`, `SHOPSPHERE20`), and automated local storage caching.
* **Stripe Payments**: Real credit card processing via Stripe PaymentIntents with an automated local fallback sandbox simulator.
* **Admin Control Center**: Custom metrics cards, transactional graphs, and tables supporting full CRUD operations.
* **Adaptive Dark Mode**: Tailwind-powered dark/light interface with persistent theme caching.
* **SEO Optimized**: Meta description indexing, Open Graph tags, robots crawl directives, and custom sitemaps.

---

## 📂 Project Architecture

```text
Full-Stack-E-Commerce-Marketplace/
├── client/              # React + Vite + Tailwind CSS Frontend
│   ├── public/          # Static assets (robots.txt, sitemap.xml)
│   └── src/
│       ├── components/  # Navbar, Footer, ProductCard, CartDrawer, etc.
│       ├── context/     # AuthContext, CartContext (Cart/Wishlist)
│       ├── layouts/     # MainLayout wrapping navbar & footer
│       ├── pages/       # Home, Products, Details, Checkout, Admin, etc.
│       ├── services/    # api.js fetch client with JWT interceptor
│       └── index.css    # Tailwind CSS layers + custom scrollbars/animations
│
└── server/              # Node.js + Express + MongoDB Backend
    ├── config/          # db.js connection, seeder.js database scripts
    ├── controllers/     # Controller handlers (Auth, Product, Order, User)
    ├── middleware/      # protect JWT verification, isAdmin, errorHandlers
    ├── models/          # Mongoose document schemas (User, Product, Order, Category)
    └── routes/          # API route definitions
```

---

## 🛠️ Local Development & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB (Local community server or Atlas database cloud account)

### 1. Server Setup
Navigate into the server folder, configure your environment variables, install dependencies, seed the database, and launch the API server:

```bash
cd server

# Install dependencies
npm install

# Run database seeder (seeds default categories, products, test customer & admin)
npm run seed

# Run in development mode (with nodemon reloading)
npm run dev
```

### 2. Client Setup
Open a separate terminal, navigate to the client folder, install dependencies, and start the local Vite development server:

```bash
cd client

# Install dependencies
npm install

# Start Vite server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## ⚙️ Environment Variables Config Guide

Create a `.env` file in the `/server` directory:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | Local express server port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb://127.0.0.1:27017/shopsphere` |
| `JWT_SECRET` | Secret key used to encrypt JWT tokens | `shopsphere_secret_jwt_key_12345` |
| `STRIPE_SECRET_KEY` | Stripe Secret API Key (Developer Dashboard) | `your_stripe_secret_key_here` |
| `NODE_ENV` | Current system environment mode | `development` |

---

## 📊 Database Models (MongoDB Schemas)

### User Schema (`server/models/user.js`)
* `name` (String, required)
* `email` (String, required, unique)
* `password` (String, required - hashed with bcrypt before saving)
* `role` (String, enum: `['customer', 'admin']`, default: `'customer'`)
* `addresses` (Array of Address: `street`, `city`, `state`, `zipCode`, `country`, `isDefault`)
* `wishlist` (Array of ObjectIds, ref: `'Product'`)
* `cart` (Array of CartItem: `product` [ref: Product], `quantity` [Number])

### Product Schema (`server/models/product.js`)
* `name` (String, required)
* `description` (String, required)
* `price` (Number, required)
* `category` (String, required)
* `stock` (Number, required, default: `0`)
* `image` (String, required URL)
* `rating` (Number, default: `0`)
* `numReviews` (Number, default: `0`)
* `reviews` (Array of Review: `user` [ref: User], `name`, `rating`, `comment`)
* `isFeatured` (Boolean, default: `false`)

### Order Schema (`server/models/order.js`)
* `user` (ObjectId, ref: `'User'`, required)
* `orderItems` (Array of OrderItem: `name`, `quantity`, `image`, `price`, `product` [ref: Product])
* `shippingAddress` (`street`, `city`, `state`, `zipCode`, `country`)
* `paymentMethod` (String, default: `'Stripe'`)
* `paymentResult` (`id` [Transaction ID], `status` [succeeded], `email`)
* `itemsPrice` / `taxPrice` / `shippingPrice` / `totalPrice` (Number)
* `isPaid` / `isDelivered` (Boolean)
* `paidAt` / `deliveredAt` (Date)
* `status` (String, enum: `['processing', 'shipped', 'delivered', 'cancelled']`)

---

## 📡 RESTful API Documentation

All API requests expect headers `'Content-Type': 'application/json'`. For protected endpoints, attach header `Authorization: Bearer <TOKEN>`.

### Authentication
* `POST /api/auth/register` - Creates a new user profile.
  * *Request Body*: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
* `POST /api/auth/login` - Authenticates user & returns token.
  * *Request Body*: `{ "email": "john@example.com", "password": "password123" }`
* `GET /api/auth/profile` - Retrieves logged-in user profile detail (Protected).
* `PUT /api/auth/profile` - Updates name, email, password, or shipping addresses (Protected).

### Products
* `GET /api/products` - Returns list of products. Supports queries `?keyword=head&category=Electronics&minPrice=50&maxPrice=300&rating=4&sortBy=Price Low to High&page=1`.
* `GET /api/products/:id` - Returns detailed information for a single product.
* `POST /api/products/:id/reviews` - Submit product rating and review (Protected).
  * *Request Body*: `{ "rating": 5, "comment": "Excellent quality wireless audio!" }`
* `POST /api/products` - Creates new product (Admin Only).
* `PUT /api/products/:id` - Updates product detail attributes (Admin Only).
* `DELETE /api/products/:id` - Deletes product from inventory catalog (Admin Only).

### Orders
* `POST /api/orders` - Creates a new customer transaction log (Protected). Decrements stock levels.
  * *Request Body*: `{ "orderItems": [...], "shippingAddress": {...}, "paymentMethod": "Stripe", "totalPrice": 231.99, "paymentResult": { "id": "stripe_id", "status": "succeeded" } }`
* `GET /api/orders/myorders` - Retrieves logged-in user's orders log (Protected).
* `GET /api/orders/:id` - Get detail attributes for single transaction (Protected - Owner or Admin).
* `PUT /api/orders/:id/deliver` - Updates delivery status flag (Admin Only).
* `GET /api/orders` - Returns all orders list (Admin Only).

### Admin Dashboard Stats
* `GET /api/users/stats` - Compiles metrics: sales revenue, category distribution, monthly charts (Admin Only).

### Payments
* `POST /api/payment/create-payment-intent` - Initializes Stripe session. Returns transaction `clientSecret` (Protected).

---

## 🌐 Production Deployment Guide

### 1. MongoDB Atlas Configuration
1. Register on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Free Shared cluster. Set network access whitelist to `0.0.0.0/30` (allow all connections) or configure Render IP ranges.
3. Generate database access credentials. Copy the connection URI string:
   `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/shopsphere`

### 2. Backend Deployment (Render)
1. Register on [Render](https://render.com).
2. Tap **New +** and select **Web Service**. Connect your GitHub repository.
3. Configure service parameters:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Under **Advanced / Environment Variables**, add your keys:
   * `MONGO_URI` (Your MongoDB Atlas connection string)
   * `JWT_SECRET` (A strong random key)
   * `STRIPE_SECRET_KEY` (Stripe Dashboard secret key)
   * `NODE_ENV` (Set to `production`)
5. Click **Create Web Service**. Save the generated URL (e.g., `https://shopsphere-server.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Register on [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**. Import your GitHub repository.
3. Configure project options:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `client`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_URL` -> (Your deployed Render API endpoint URL, e.g., `https://shopsphere-server.onrender.com/api`)
5. Click **Deploy**. Vercel will build the frontend assets, generate minified bundles, and publish the live URL.
