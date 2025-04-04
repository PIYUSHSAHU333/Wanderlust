

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
-epress-sessions

---

## ⚡ Installation

```bash
git clone https://github.com/yourusername/airbnb-clone.git
cd airbnb-clone
npm install
npm start
