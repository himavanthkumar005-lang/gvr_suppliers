# GVR Suppliers - Tent House & Event Rentals Web Application

Welcome to **GVR Suppliers**, a full-featured web application for a premier Tent House and Event Equipment Rental center. Built with **React.js (JSX)**, styled with **Bootstrap 5**, and powered by a reactive **JSON Database** with LocalStorage persistence.

---

## 🌟 Key Features

### 1. Navigation & Branding
- **Sticky Responsive Navigation Bar**:
  - `Home` | `About` | `Services` | `Products/Rentals` | `Packages` | `Book Now` | `My Bookings` | `Contact` | `Login / Register` / `Admin Dashboard`
  - Floating WhatsApp action button for instant direct chats.

### 2. High-Impact Hero Section
- Dynamic headline, event highlights, trust badges (15+ Years, 100% Weatherproof German PVC, On-time setup guarantee).
- Interactive Quick Event Estimator & Reservation wizard right on the hero banner.

### 3. Pages & Features
- **Home**: Hero section, service cards, featured rental products, popular packages, testimonials, and quick quotation calculator.
- **About**: Journey of GVR Suppliers, warehouse scale (85,000+ sq ft tents, 10,000+ chairs, 12 transport trucks, 150+ skilled crew).
- **Services**: 6 specialized service categories (Waterproof Tents, Wedding Mandapams, Stage Lights, JBL Sound, Catering Utensils, Generators & Cooling).
- **Products / Rentals**: Categorized catalog with category filter pills, real-time search, sorting, and detail modal with daily rates.
- **Packages**: Curated all-inclusive bundles (Grand Royal Wedding, Reception & Sangeet Night, Birthday Party Canopy, Traditional Puja/Housewarming, Corporate Seminar).
- **Book Now**: Interactive booking wizard with live quotation calculation (duration, packages, custom individual items, 5% logistics, advance deposit).
- **My Bookings**: Customer booking tracker, real-time status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`), reference search, and printable invoice generator.
- **Contact**: Office address, phone numbers, WhatsApp, business hours, and interactive inquiry form that logs directly into the admin dashboard.
- **Login & Register**: Distinct role-based authentication for **Customer** and **Admin** with 1-click demo login buttons.
- **Admin Dashboard**:
  - Overview KPI metrics (Total Bookings, Revenue, Active Equipment, Pending inquiries).
  - Booking management (Approve, Confirm, Complete, Cancel).
  - Equipment inventory management (Add, edit, delete rental items).
  - Customer inquiry viewer & responder.
  - JSON database export & reset functionality.

---

## 🔐 Demo Credentials

| Role | Email | Password | Access / Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gvr.com` | `admin123` | Full access to Admin Dashboard, inventory CRUD, and booking approvals |
| **Customer** | `user@gvr.com` | `user123` | Access to personal bookings, new reservations, and invoices |

> **Admin Registration Security Passkey**: When registering a new Admin account, enter the passkey: `GVR2026`.

---

## 🛠️ Tech Stack
- **Frontend**: React 18 (JSX), Vite, React Router v6
- **Styling**: Bootstrap 5.3, Bootstrap Icons, custom Google Fonts (*Playfair Display* & *Plus Jakarta Sans*)
- **Database**: JSON (`src/data/db.json`) synced with browser `localStorage` for instant reactive persistence without needing external backend servers.

---

## 🚀 Running the Application Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. Production Build:
   ```bash
   npm run build
   ```
