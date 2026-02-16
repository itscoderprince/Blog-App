# 🚀 MERN Blog App - Full Stack Modern Blogging Platform

A premium, feature-rich blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). This application features Role-Based Access Control (RBAC), a professional admin dashboard, global search, and a responsive UI.

## ✨ Key Features

- **🔐 Advanced Authentication**: JWT-based auth with secure cookie storage and Google OAuth integration.
- **🛡️ RBAC (Role-Based Access Control)**:
  - **User**: Read blogs, like, save, and comment.
  - **Admin**: Full access to User Management, Comment Moderation, and Category control.
- **📊 Admin Dashboard**:
  - **User Management**: Promote/demote users, delete accounts.
  - **Comment Moderation**: Platform-wide comment management and deletion.
- **📝 Blog Management**: Full CRUD operations with Cloudinary for image uploads.
- **🔍 Global Search**: Debounced real-time search across all blog posts.
- **📱 Responsive UI**: Built with Tailwind CSS and Shadcn UI for a premium experience.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite
- Zustand (State Management)
- Shadcn UI + Tailwind CSS
- React Router DOM
- Sonner (Notifications)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Cloudinary (Image Hosting)
- Multer (File Handling)

---

## 📁 Project Structure

```bash
├── Client/                 # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── helpers/        # Route constants and utility functions
│   │   ├── Layout/         # Page layouts and main pages
│   │   ├── store/          # Zustand stores (Auth, Blog, Category)
│   │   └── App.jsx         # Main routing and entry point
├── Server/                 # Backend (Node.js + Express)
│   ├── controllers/        # Business logic for Auth, Blog, Users, Admin
│   ├── models/             # Mongoose schemas (User, Blog, Comment, Category)
│   ├── routes/             # API endpoint definitions
│   ├── helpers/            # Middleware (Auth, Multer, Cloudinary)
│   └── index.js            # Express server entry point
└── vercel.json             # Deployment configuration for Vercel
```

---

## 🔄 Code Flow Overview

### 1. Authentication Flow
- **Login**: Backend validates credentials → Generates JWT (including `role`) → Sends to client via `httpOnly` cookie.
- **State**: `useAuthStore` (Zustand) manages the local user state and synchronization with the browser.
- **Protection**: `authenticate` middleware on the backend verifies tokens; `AuthRedirect` on frontend handles route guarding.

### 2. Blog Management Flow
- **Fetch**: `Index.jsx` calls `fetchBlogs` from `useBlogStore`.
- **Search**: `SearchInput.jsx` updates search parameters with debouncing, triggering a re-fetch of filtered data.
- **Upload**: `multer` captures files → `cloudinary.js` uploads to the cloud → URL saved in MongoDB.

### 3. Admin & RBAC Flow
- **Check**: `isAdmin` middleware intercepts administrative routes (`/api/admin/*`, `/api/user/all`, etc.).
- **Dashboard**: `ManageUsers.jsx` and `ManageComments.jsx` fetch data directly from these protected endpoints.
- **Sidebar**: `AppSidebar.jsx` filters navigation items based on the user's role obtained from `useAuthStore`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/itscoderprince/Blog-App.git
   ```

2. **Setup Server:**
   ```bash
   cd Server
   npm install
   # Create .env with MONGODB_URI, JWT_SECRET, CLOUDINARY_*, and PORT
   npm start
   ```

3. **Setup Client:**
   ```bash
   cd ../Client
   npm install
   # Create .env with VITE_API_BASE_URL and Firebase keys
   npm run dev
   ```

---

## 📄 License

This project is licensed under the ISC License.
