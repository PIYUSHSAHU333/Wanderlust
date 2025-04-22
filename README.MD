

#A full-stack Website to list your home for rental purposes and to book other listings as well built using Node.js, Express, MongoDB, and EJS — featuring real-time chat, wishlist management, Razorpay payment integration, advanced search, and more.

---

## 🚀 Features

### 🛏️ For Guests
- **Explore Listings:** Browse rental homes with images, details, and host information.
- **Search Functionality:** Search listings by city, date, guest count, or keywords.
- **Book Listings:** Securely book a stay using integrated **Razorpay** payments.
- **Real-Time Chat:** Chat with hosts using **Socket.IO** in a private messaging system.
- **Wishlist:** Add or remove listings to your personal wishlist.
- **Notifications:** Get notified about bookings, messages, and updates.
- **Help Centre:** Access FAQs or contact support for help anytime.
- **Manage Account:** Update your profile details.

### 🏠 For Hosts
- **List Your Home:** Create a new listing with photos, price, amenities, and availability.
- **Manage Listings:** Edit, delete, or update availability of your listed properties.
- **Chat with Guests:** Respond to messages in real-time (guests initiate chats).
- **Get Bookings:** Receive payments via **Razorpay**, manage your rental business easily.

---

## 🧰 Tech Stack

- **Frontend:** EJS, HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Authentication:** Passport.js (Local Strategy)
- **Real-Time:** Socket.IO (one-to-one private rooms)
- **Payments:** Razorpay API
- **Notifications:** Flash messages / custom alert system
- **Other:** Multer (image upload), dotenv, method-override

---

## 🔐 Authentication & Authorization

- User registration & login
- Session-based authentication (cookies)
- Express-sessions for session management

---

## ⚡ Installation

### 🔐 Setup Environment Variables

Before running the project, you'll need to set up the environment variables.

1. **Create a `.env` file in the root of the project by copying `.env.example`.

   ```bash
   cp .env.example .env 

2.Edit the .env file with your own credentials. Here's a breakdown of the required environment variables:

ATLASDB_URL: Your MongoDB Atlas connection string.

CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET: Credentials for your Cloudinary account to handle image uploads.

MAP_TOKEN: Your Mapbox API token for maps.

SECRET, SECRETSTORE: Session secret values for securing user sessions.

SMTP_USER, SMTP_PASS: Your email address and password for sending emails via Nodemailer (e.g., Gmail).

RAZORPAY_KEY, RAZORPAY_SECRET: Your Razorpay API keys for processing payments.

```bash
git clone https://github.com/PIYUSHSAHU333/Wanderlust.git
cd Wanderlust
npm install
npm start
