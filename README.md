<div align="center">
  <img src="https://raw.githubusercontent.com/NARESH-SAI-ARAVIND-S-142/Ecommerce-website/main/client/public/icons.svg" alt="NexMart Logo" width="140" />

  # ⚡ NexMart : Intelligent E-Commerce Architecture
  
  **A monolithic, enterprise-grade e-commerce application powered by the MERN Stack, Next-Gen UI/UX design patterns, Stripe Webhooks, and Anthropic's Claude 3 AI.**

  [![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-Backend-404D59?style=for-the-badge)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
  [![Anthropic](https://img.shields.io/badge/Claude_3-AI_Assistant-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com/)

  *Engineered for scale, security, and seamless user experiences.*
</div>

---

## 📖 Table of Contents
1. [Project Abstract](#-project-abstract)
2. [Pin-to-Pin Feature Breakdown](#-pin-to-pin-feature-breakdown)
3. [Deep-Dive Architecture](#-deep-dive-architecture)
4. [Database Schema Mapping](#-database-schema-mapping)
5. [API Routing Index](#-api-routing-index)
6. [Folder Structure](#-folder-structure)
7. [Comprehensive Setup Guide](#-comprehensive-setup-guide)
8. [Environment Variables Dictionary](#-environment-variables-dictionary)
9. [Future Roadmap & Scaling](#-future-roadmap--scaling)

---

## 🌐 Project Abstract

**NexMart** is not just an online store; it is a demonstration of modern, full-stack architectural mastery. It diverges from standard e-commerce tutorials by implementing real-world, production-ready systems. 

Rather than relying entirely on the frontend to dictate payment success, NexMart employs **cryptographically verified Stripe Webhooks** for secure backend order fulfillment. Rather than simple keyword searches, it embeds an **Anthropic Claude 3 AI Assistant** that understands complex natural language and programmatically queries the database. From automated PDF invoice generation to Cloudinary CDN image pipelines, every micro-interaction has been engineered to mimic the robust standards of industry-leading tech companies.

---

## ✨ Pin-to-Pin Feature Breakdown

### 🤖 1. The Claude 3 AI Shopping Assistant
- **Floating Chat Interface:** A globally persistent chat widget utilizing `framer-motion` for fluid opening, closing, and typing indicator micro-animations.
- **Intent Parsing:** Uses Anthropic's `claude-3-haiku` model with a rigorously defined System Prompt to extract user intent. 
- **JSON Parameter Extraction:** When a user asks "Show me laptops under ₹50,000", Claude replies with a structured `<search_params>` JSON block.
- **Automated Database Interfacing:** The Express backend parses Claude's JSON, constructs a MongoDB query using `$text` indexing, regex matching, and `$lte`/`$gte` price filtering, and returns populated product cards directly into the chat UI.
- **Fallback Engine:** If API rate limits are hit, it automatically reverts to a custom local keyword-matching algorithm, ensuring 100% uptime.

### 💳 2. Payment & Fulfillment Infrastructure
- **Stripe Payment Intents:** Employs the modern Stripe Elements pipeline, capturing payments securely on the client side without PCI-compliance overhead.
- **Webhook Verification:** Exposes an `express.raw()` endpoint that validates `stripe-signature` headers against a local `STRIPE_WEBHOOK_SECRET`. This completely eliminates the risk of clients spoofing successful payments.
- **Auto-Fulfillment Pipeline:** Upon receiving the `payment_intent.succeeded` webhook, the backend autonomously transitions the Order status to `Paid`.

### 📄 3. Document Generation & Dispatch
- **In-Memory PDF Generation:** Utilizes `pdfkit` to dynamically draw a branded, formatted invoice PDF as a Node `Buffer`—avoiding unnecessary disk I/O.
- **Nodemailer SMTP:** Seamlessly attaches the PDF buffer to a styled HTML confirmation email, dispatching it to the user the exact second their Stripe payment clears.
- **On-Demand Downloads:** Secure, authorized backend routes allow users to download their PDF invoices directly from their Order History dashboard.

### 🖼️ 4. Asset Management via Cloudinary
- **CDN Upload Pipeline:** Admins upload high-resolution product imagery through the `ImageUploadModal`.
- **Multer Integration:** Files are processed in memory via `multer` and streamed directly to Cloudinary using `multer-storage-cloudinary`.
- **Auto-Optimization:** Cloudinary automatically crops, compresses, and delivers images via edge networks for blazing-fast page loads.

### 🛍️ 5. Advanced Shopping Mechanics
- **Robust Cart & Checkout:** Persistent Redux Toolkit cart state, with calculated tax logic, dynamic shipping rates, and step-by-step checkout wizards.
- **Coupon System:** A dedicated `Coupon` schema. Users can apply codes (e.g., `SAVE20`) which trigger backend recalculations to enforce minimum purchase bounds and expiry dates.
- **Wishlists & Reviews:** Users can heart products to save to their personalized Wishlist. A verified review system prevents users from reviewing products they haven't purchased.
- **Variants & Inventory:** Deep inventory tracking. When an order completes, the exact variant's (Color/Size) stock count is decremented safely via atomic operations.

### 🎨 6. Premium UX / UI Engineering
- **Glassmorphism Aesthetic:** Translucent components layered over dynamic gradients, employing backdrop blurs to achieve an "Apple-like" spatial design.
- **Route Suspense & Skeletons:** React `lazy()` loading paired with custom skeleton UI loaders to prevent layout shift during chunk fetching.
- **Responsive Fluidity:** 100% mobile-responsive layouts tailored for every breakpoint.

---

## 📈 Project Evolution (Phases 7, 8, & 9)

NexMart was built progressively. While early phases established the core MERN architecture, **Phases 7, 8, and 9** were course-correction sprints designed to elevate the platform from a standard store to an ultra-pro, production-grade application.

### Phase 7: Engagement Mechanics
Focusing on customer retention and interactivity:
- **Coupons Engine:** Implemented a `Coupon` model and Redux thunks to calculate percentage-based discounts dynamically at checkout.
- **Wishlists:** Added persistent wishlist arrays to the `User` model, allowing customers to heart and save products for later.
- **Verified Reviews:** Built an interactive `StarRating` system. The backend validates if a user has actually purchased the product before allowing them to leave a review.

### Phase 8: Enterprise Infrastructure
Focusing on secure, autonomous operations:
- **Stripe Webhooks (`express.raw()`):** Shifted order fulfillment from the insecure frontend to a cryptographically secure backend listener.
- **PDF Invoice Engine:** Engineered an in-memory PDF builder using `pdfkit` that fires autonomously on payment success.
- **Cloudinary CDN Integration:** Built an `ImageUploadModal` using `multer` to stream admin product uploads directly to edge-optimized Cloudinary servers.

### 🌟 Phase 9: The AI Shopping Assistant (Star Feature)
The crown jewel of NexMart is the **Phase 9 Anthropic Claude Integration**. We bypassed traditional, clunky keyword search bars by embedding a highly intelligent, conversational AI widget into the bottom corner of the viewport.
- **Natural Language to NoSQL:** The backend instructs Claude 3 Haiku to extract intent (e.g., *“budget laptops”*) and converts its JSON response into complex MongoDB `$text` and price-boundary `$gte`/`$lte` queries.
- **Rich Media Chat:** The chat window doesn't just return plain text—it actively renders interactive, clickable product cards pulled live from the database inventory!
- **Framer Motion Micro-interactions:** The chat widget bounds and snaps into view with satisfying, physics-based physics, giving the entire application a premium, polished feel.

---

## 🏛️ Deep-Dive Architecture

### The Stripe Webhook Flow
To guarantee transactional integrity, NexMart relies on asynchronous webhooks rather than client-side promises.

1. **Client** requests a `clientSecret` from `/api/orders/create-payment-intent`.
2. **Server** calculates the exact total by re-querying the database (preventing client-side price tampering) and generates a Stripe Intent.
3. **Client** completes the payment via Stripe Elements.
4. **Stripe Servers** securely POST an event payload to `NexMart Server` at `/api/webhooks/stripe`.
5. **Server** validates the cryptographic signature. Upon validation, the `Order` is marked as `Paid`.
6. **Server** triggers `invoice.js` to build a PDF buffer, and `sendEmail.js` to dispatch it.

---

## 🗄️ Database Schema Mapping

NexMart utilizes Mongoose ODM with highly relational schemas:

*   **`User`**: Manages authentication logic, role definition (`admin` vs `customer`), and stores array references for `wishlist`.
*   **`Product`**: Complex schema housing `variants` (color, size, stock, dynamic pricing), `images` (Cloudinary URLs), categories, and an aggregated `rating` field.
*   **`Order`**: Tracks immutable snapshots of `orderItems`, `shippingAddress`, monetary breakdowns (`taxPrice`, `shippingPrice`), and arrays for `statusHistory`.
*   **`Review`**: Tied to both `User` and `Product`. Enforces a strict one-review-per-user policy.
*   **`Coupon`**: Maintains `code`, `discountPercentage`, `minPurchase`, and `expiryDate`.

---

## 🗺️ Folder Structure

```text
Ecommerce-website/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── assets/             # Static SVGs and Imagery
│   │   ├── components/         # Reusable UI Blocks
│   │   │   ├── admin/          # RBAC Protected Admin Views
│   │   │   ├── cart/           # Cart Drawer & Coupon Logic
│   │   │   ├── chat/           # Claude AI Floating Widget
│   │   │   ├── common/         # Buttons, Modals, Loaders
│   │   │   └── product/        # Grids, Galleries, Reviews
│   │   ├── hooks/              # Custom Hooks (useAuth, useInfiniteScroll)
│   │   ├── pages/              # Primary Route Views
│   │   ├── redux/              # Redux Toolkit Store & Slices
│   │   └── utils/              # Axios Interceptors & Formatters
│   └── tailwind.config.js      # Global Design System Tokens
│
└── server/                     # Node.js/Express Backend
    ├── config/                 # DB, Stripe, and Cloudinary Bootstrappers
    ├── controllers/            # Core Business Logic & Endpoint Handlers
    ├── middleware/             # Auth Guards, Error Handling, Rate Limiting
    ├── models/                 # Mongoose Schemas
    ├── routes/                 # Express Router Configurations
    ├── utils/                  # PDF Generators & SMTP Transporters
    └── server.js               # Application Entry Point & Webhook Mounts
```

---

## 🔌 API Routing Index

### Authentication (`/api/auth`)
*   `POST /register` - Provision a new user.
*   `POST /login` - Authenticate and issue HTTP-only JWT.
*   `POST /logout` - Clear cookie state.
*   `GET /me` - Retrieve current session payload.

### Products (`/api/products`)
*   `GET /` - Fetch catalog (supports `keyword`, `category`, `sort` querying).
*   `GET /:id` - Retrieve singular product document.
*   `POST /upload` - **[Admin]** Multipart form upload to Cloudinary.

### Orders (`/api/orders`)
*   `POST /` - Initialize an order payload.
*   `POST /create-payment-intent` - Generate Stripe processing token.
*   `GET /myorders` - Fetch authenticated user's history.
*   `GET /:id/invoice` - Stream generated PDF invoice buffer.

### Artificial Intelligence (`/api/ai`)
*   `POST /chat` - Interfaces with Claude 3 API for intent parsing.

*(Extensive routes also exist for `/reviews`, `/wishlist`, and `/coupons`)*

---

## 💻 Comprehensive Setup Guide

### 1. Repository Initialization
Ensure you have Node 18+ and a running MongoDB instance.
```bash
git clone https://github.com/NARESH-SAI-ARAVIND-S-142/Ecommerce-website.git
cd Ecommerce-website
```

### 2. Dependency Resolution
You must install `node_modules` for both environments independently.
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Database Seeding (Optional)
To populate your MongoDB database with sample products and an admin account (`admin@example.com` / `123456`):
```bash
cd server
npm run data:import
```

### 4. Bootstrapping Development Servers
Run the following commands in two separate terminal instances:

**Terminal A (Backend):**
```bash
cd server
npm run dev
```

**Terminal B (Frontend):**
```bash
cd client
npm run dev
```

Navigate to `http://localhost:5173` to view the application.

---

## 🔑 Environment Variables Dictionary

Create a `.env` file inside the `server/` directory and map these keys:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Must be `development` or `production`. |
| `PORT` | The Express listening port (Default `5000`). |
| `MONGO_URI` | MongoDB connection string (Atlas or `mongodb://localhost:27017/nexmart`). |
| `JWT_SECRET` | Cryptographic hash key for JSON Web Tokens. |
| `CLIENT_URL` | Cross-Origin bounding (e.g., `http://localhost:5173`). |
| `STRIPE_SECRET_KEY` | Private key from Stripe Developer Dashboard. |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) used to verify Stripe payloads. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard identifier. |
| `CLOUDINARY_API_KEY` | Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret. |
| `SMTP_HOST` | Email provider host (e.g., `smtp.gmail.com`). |
| `SMTP_PORT` | Email TLS port (typically `587`). |
| `SMTP_USER` | Email account username. |
| `SMTP_PASS` | Email account App Password. |
| `ANTHROPIC_API_KEY` | Claude 3 API Key (`sk-ant-api03-...`). |

---

## 📈 Future Roadmap & Scaling
- **Redis Caching:** Implement Redis layer for `/api/products` caching to reduce MongoDB read load by 80%.
- **Elasticsearch:** Replace MongoDB `$text` indices with an Elasticsearch cluster for typo-tolerant, fuzzy product searching.
- **Dockerization:** Containerize the Client, Server, and Database using `docker-compose` for rapid CI/CD deployments.
- **WebSocket Notifications:** Push real-time toast notifications to users when an admin transitions their order to `Shipped`.

<br />

<div align="center">
  <b>Designed and Developed by Naresh Sai Aravind</b><br/>
  <i>Pushing the boundaries of what is possible with the MERN Stack.</i>
</div>
