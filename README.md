# 🛍️ NexMart E-Commerce Platform

![NexMart Banner](https://via.placeholder.com/1200x400/0f172a/00c9a7?text=NexMart+E-Commerce+Platform)

> A premium, highly optimized, full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Redux Toolkit, Tailwind CSS, and Stripe.

NexMart is a production-ready e-commerce platform designed with a focus on **cinematic UI/UX**, **high performance**, and **secure transactions**. It features a modern dark-mode aesthetic with glass-morphic elements and buttery-smooth Framer Motion animations.

## ✨ Features

### 🛒 Customer Experience
*   **Premium UI/UX:** Futuristic dark mode, dynamic gradients, glassmorphism, and responsive micro-animations.
*   **Intelligent Search:** Millisecond-optimized MongoDB text indexing with debounced frontend queries.
*   **Infinite Scrolling:** High-performance catalog browsing utilizing the React Intersection Observer API.
*   **Persistent Cart:** LocalStorage-synced Redux cart drawer that auto-updates across tabs and reloads.
*   **Secure Checkout:** Multi-step Stripe Elements integration for encrypted payment processing.
*   **Order Tracking:** Detailed, color-coded timelines for users to track their orders from processing to delivery.
*   **User Profiles:** Self-service portal for customers to manage their details and secure passwords.
*   **OAuth Integration:** Seamless 1-click Google Sign-In alongside standard JWT email authentication.

### 🛡️ Admin Dashboard
*   **Distraction-Free Layout:** A dedicated admin interface with a secure side-navigation layout.
*   **Live Analytics:** Aggregated real-time metrics for total revenue, active users, and order volume.
*   **Inventory Management:** Intuitive CRUD tables to monitor stock, adjust pricing, and flag products.
*   **Order Fulfillment:** Centralized hub to update tracking statuses (Processing, Packed, Shipped, Delivered) instantly.
*   **Role Management:** Safeguarded UI to view all registered customers and provision new Admin accounts.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React 18 (Vite)
*   **State Management:** Redux Toolkit (`@reduxjs/toolkit`) & React-Redux
*   **Styling:** Tailwind CSS (Custom Color Tokens & Glassmorphism Utilities)
*   **Animations:** Framer Motion
*   **Routing:** React Router v6
*   **Forms & Notifications:** React Hot Toast
*   **Payments:** Stripe Elements (`@stripe/react-stripe-js`)

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB & Mongoose ORM
*   **Authentication:** JSON Web Tokens (JWT) & Google OAuth
*   **Payments:** Stripe Node.js SDK
*   **Security:** Helmet, CORS, Express Rate Limit, Mongo Sanitize

---

## 🚀 Quick Start Guide

Follow these steps to get your local development environment up and running.

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/en/) (v16.0 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)
*   [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/ecommerce.git
cd ecommerce
```

### 3. Install Dependencies
You will need to install dependencies for both the frontend (`client`) and backend (`server`).

```bash
# Install root (concurrently) dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 4. Environment Variables
Create a `.env` file in the root of the `server` directory and a `.env` file in the root of the `client` directory. Use the provided `.env.example` files as templates.

**`server/.env`**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 5. Seed the Database
Populate your database with dummy users and products to test the platform immediately.

```bash
cd server
npm run data:import
```
*(Note: To destroy all data, you can run `npm run data:destroy`)*

### 6. Run the Application
From the root directory of the project, run the concurrently script:

```bash
npm run dev
```

*   **Frontend Development Server:** `http://localhost:5173`
*   **Backend API Server:** `http://localhost:5000`

---

## 🏗️ Project Architecture

```text
ecommerce/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Buttons, Inputs, Modals)
│   │   ├── hooks/              # Custom React hooks (useAuth, useDebounce, etc.)
│   │   ├── pages/              # Main route views (Home, Products, Admin pages)
│   │   ├── redux/              # Global state slices (cart, auth, order, product, admin)
│   │   └── utils/              # Axios API configurations
│   ├── index.css               # Tailwind directives & Custom glassmorphism classes
│   └── vite.config.js          # Vite bundler configuration
│
└── server/                     # Express Backend
    ├── controllers/            # Route logic (Auth, Product, Order, User)
    ├── middleware/             # Error handlers, JWT verification, Rate limiters
    ├── models/                 # Mongoose schemas (User, Product, Order)
    ├── routes/                 # Express API routers
    └── server.js               # Main Express application entry point
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
*Built with ❤️ by the NexMart Team.*
