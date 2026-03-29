# ResQmeal (Zero Waste AI) 🥗🚴✨

**Connecting food surplus with those in need using AI-driven safety checks and real-time tracking.**

ResQmeal is a decentralized food donation platform designed to bridge the gap between food surplus (Donors) and food scarcity (Receivers) through an efficient, volunteer-led delivery network.

---

## 🚀 Vision
Every year, 1.3 billion tons of food is wasted while millions go hungry. ResQmeal uses AI to verify food safety and OSRM for real-time routing, ensuring that surplus food reaches its destination safely and quickly.

---

## 🏗️ Project Structure
This repository is a monorepo containing the following components:

- **`zero-waste-web/`**: The main React 18 + Vite dashboard for Donors, Volunteers, and Receivers.
- **`directives/`**: Standard Operating Procedures (SOPs) for the platform's 3-layer architecture.
- **`execution/`**: Deterministic Python scripts for model calibration and dataset analysis.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS.
- **Backend & Database**: Supabase (PostgreSQL, Auth, Realtime).
- **Maps & Routing**: Leaflet.js and OSRM (Open Source Routing Machine).
- **Icons**: Lucide React.
- **Security**: Supabase Row Level Security (RLS) and OTP-based verification.

---

## ⚙️ Quick Start (Local Setup)

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Run the SQL commands found in `zero-waste-web/supabase_setup.sql` in your Supabase SQL Editor to initialize the schema and RLS policies.

### 2. Environment Variables
Copy the `.env.example` file to `.env` in the `zero-waste-web/` directory and fill in your Supabase credentials:
```bash
cp zero-waste-web/.env.example zero-waste-web/.env
```

### 3. Install & Run
```bash
cd zero-waste-web
npm install
npm run dev
```

---

## 📱 User Flows

### 🍎 Donors
- Upload food details with AI safety classification.
- Set pickup location on an interactive map.
- Track live deliveries of your donations.

### 🚴 Volunteers
- Browse nearby pickups on a map.
- Real-time routing from Volunteer -> Donor -> Receiver.
- Securely verify deliveries via 4-digit OTP provided by the receiver.

### 🏘️ Receivers
- Manage incoming deliveries on a central dashboard.
- Generate and provide verification codes (OTP) to volunteers.
- View real-time GPS tracking of incoming food.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ by the ResQmeal Team.*
