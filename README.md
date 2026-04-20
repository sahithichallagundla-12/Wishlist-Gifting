# 🎁 Wishlist Gifting

Wishlist Gifting is a collaborative gifting platform that allows users to create wishlists, add items (with AI-powered image extraction), and share them with friends and family. Guests can reserve items to prevent duplicate gifts, and owners receive email notifications when a gift is reserved.

## ✨ Features

- **🔐 User Authentication**: Secure sign-up and login using JWT.
- **📋 Wishlist Management**: Create, update, and manage multiple wishlists for different occasions (Birthdays, Weddings, etc.).
- **🏷️ Smart Item Adding**: Add products just by providing a link. The system automatically extracts product images using scraping and AI.
- **🤝 Collaborative Gifting**: Share your wishlist link. Friends can view and "Reserve" items without needing an account.
- **📧 Notifications**: Real-time email alerts to the wishlist owner when someone reserves a gift.
- **📱 Responsive Design**: A modern, premium UI built with React and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose)
- **AI/Scraping**: [Google Gemini AI](https://ai.google.dev/), [Cheerio](https://cheerio.js.org/)
- **Email**: [Nodemailer](https://nodemailer.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (Local or Atlas)
- **Gemini API Key** (for smart image extraction)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Wishlist_Gifting
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 🏃 Running the App

### Start Backend
```bash
cd backend
npm start # or node server.js
```

### Start Frontend
```bash
cd frontend
npm run dev
```

---

## 📁 Project Structure

```text
Wishlist_Gifting/
├── backend/            # Express server & API routes
│   ├── config/         # DB connection
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── utils/          # AI & Scraping helpers
├── frontend/           # React client
│   ├── src/            # Components & Pages
│   └── public/         # Static assets
└── .gitignore          # Root ignore file
```

---

## 📝 Note on Requirements

Since this is a **Node.js** based project, dependencies are managed via `package.json` in both the `frontend` and `backend` folders. 

There is **no `requirements.txt`** file needed as that is specific to Python projects. Simply run `npm install` in each directory to set up the environment.

---

## 📄 License

Distributed under the MIT License.
