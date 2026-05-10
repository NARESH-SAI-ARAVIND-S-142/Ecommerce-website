<div align="center">
  <img src="client/public/icons.svg" alt="NexMart Logo" width="120" />

  # NexMart AI-Powered Commerce
  
  **A Next-Generation, Production-Ready E-Commerce Platform engineered with the MERN Stack and Claude 3 AI.**

  [![React](https://img.shields.io/badge/React-18.x-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Stripe](https://img.shields.io/badge/Stripe-Payments-6772E5.svg?style=for-the-badge&logo=stripe)](https://stripe.com/)
  [![Anthropic](https://img.shields.io/badge/Claude_3-AI_Assistant-D97757.svg?style=for-the-badge&logo=anthropic)](https://www.anthropic.com/)
</div>

<br />

> **NexMart** is not just another e-commerce clone. It is a highly scalable, full-stack platform built with enterprise-grade infrastructure. From cryptographically secure Stripe webhooks to dynamic PDF invoice generation and an embedded Claude 3 Shopping Assistant, NexMart represents the pinnacle of modern web development.

---

## ✨ Enterprise-Grade Features

### 🧠 Intelligent AI Shopping Assistant
- **Claude 3 Haiku Integration:** A globally accessible, floating chat widget powered by Anthropic's Claude 3.
- **Natural Language Parsing:** Converts human queries ("I need a cheap laptop") into structured JSON search parameters.
- **Dynamic Catalog Querying:** Executes advanced `$text` and Regex queries against the MongoDB database based on AI parameters, rendering interactive product cards directly in the chat stream.
- **Resilient Fallback Engine:** Gracefully falls back to a custom local keyword-extraction algorithm if API rate limits are hit or keys are missing.

### 💳 Robust Payment & Fulfillment Infrastructure
- **Stripe Elements & Intents:** PCI-compliant checkout flow utilizing Stripe Payment Intents.
- **Cryptographic Webhooks:** Secure backend listener (`express.raw()`) that verifies Stripe signatures to prevent spoofing, autonomously updating order statuses to `Paid` upon asynchronous success.
- **Automated PDF Generation:** Utilizes `pdfkit` to dynamically generate professional, branded invoices in-memory.
- **Nodemailer Dispatch:** Automatically attaches the generated PDF buffer to an HTML-templated email and dispatches it to the customer via SMTP upon successful payment.

### 🔐 Security & Architecture
- **JWT & HTTP-Only Cookies:** Secure, stateless authentication flow protecting against CSRF and XSS attacks.
- **Role-Based Access Control (RBAC):** Strict middleware segregation between `Customer` and `Administrator` routes.
- **Rate Limiting:** IP-based request throttling (`express-rate-limit`) specifically hardened on authentication and AI endpoints to mitigate brute-force and DDoS vectors.
- **Cloudinary CDN:** Direct integration with Cloudinary for scalable, optimized product image hosting and transformations.

### 🎨 State-of-the-Art UX/UI
- **Premium Glassmorphism:** A breathtaking UI engineered with Tailwind CSS, featuring backdrop blurs, subtle gradients, and custom scrollbars.
- **Framer Motion:** High-performance, physics-based micro-animations for route transitions, modals, and interactive elements.
- **Redux Toolkit:** Centralized, predictable state management with `createAsyncThunk` for optimized network request handling.

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, React Router DOM |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | MongoDB (Atlas / Local) |
| **Integrations** | Stripe API, Anthropic (Claude 3), Cloudinary, Nodemailer, PDFKit |
| **Tooling** | ESLint, Prettier, Git, Postman |

---

## 🚀 Quick Start Guide

### Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or Atlas URI)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/NARESH-SAI-ARAVIND-S-142/Ecommerce-website.git
cd Ecommerce-website
```

### 2. Environment Configuration
You need to set up environment variables for both the client and the server.

**Server Environment (`server/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_ultra_secure_jwt_secret
CLIENT_URL=http://localhost:5173

# Stripe Infrastructure
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP / Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# AI Integration
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Install Dependencies & Seed Data
Install dependencies for both the frontend and backend, then seed the database with initial dummy data.
```bash
# Install server dependencies
cd server
npm install

# Seed the database (Warning: Clears existing data)
npm run data:import

# Install client dependencies
cd ../client
npm install
```

### 4. Ignite the Engines
Start the development servers concurrently.

```bash
# Terminal 1: Start the Backend (from /server)
npm run dev

# Terminal 2: Start the Frontend (from /client)
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🏗️ System Architecture

### Webhook Flow (Payment & Fulfillment)
1. User confirms payment on the Frontend via Stripe Elements.
2. Stripe processes the payment and asynchronously fires a `payment_intent.succeeded` event to `/api/webhooks/stripe`.
3. Backend verifies the signature using `STRIPE_WEBHOOK_SECRET`.
4. Backend updates the `Order` document status to `Paid`.
5. Backend invokes `pdfkit` to construct a raw PDF buffer.
6. Backend invokes `nodemailer` to send the PDF via email.

### AI Search Pipeline
1. User types query in the Frontend Chat Widget.
2. Backend receives query at `/api/ai/chat`.
3. Backend constructs a highly specific System Prompt and sends it alongside the user query to the Claude 3 API.
4. Claude extracts intent and returns a structured JSON payload (e.g., `{"keyword": "sneakers", "maxPrice": 5000}`).
5. Backend parses the JSON, constructs a Mongoose `$text` and `$lte` query, and fetches matching products.
6. Results are returned to the frontend and rendered as interactive UI cards within the chat.

---

## 🛡️ License
This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

<br />

<div align="center">
  <i>Engineered with precision for the modern web.</i>
</div>
