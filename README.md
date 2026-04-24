# 🎁 Wishlist Gifting

Wishlist Gifting is a collaborative gifting platform that allows users to create wishlists, add items (with custom or placeholder images), and share them with friends and family. Guests can reserve items to prevent duplicate gifts, and owners receive email notifications when a gift is reserved.

## ✨ Features

- **🔐 User Authentication**: Secure sign-up and login using JWT.
- **📋 Wishlist Management**: Create, update, and manage multiple wishlists for different occasions (Birthdays, Weddings, etc.).
- **🖼️ Smart Image Extraction**: Add products with just a product URL. Images are automatically extracted from the product page using advanced web scraping. Falls back to AI-generated placeholders if extraction fails.
- **🤖 AI Image Generation**: Supports Google Gemini-2.0-flash and Imagen-3.0 for generating professional product images.
- **🤝 Collaborative Gifting**: Share your wishlist link. Friends can view and "Reserve" items without needing an account.
- **📧 Notifications**: Real-time email alerts to the wishlist owner when someone reserves a gift.
- **📱 Responsive Design**: A modern, premium UI built with React and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Image Processing**: [Axios](https://axios-http.com/), [Cheerio](https://cheerio.js.org/) (Web scraping)
- **AI Models**: [Google Generative AI SDK](https://ai.google.dev/) (Gemini, Imagen)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (Local or Atlas)

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
   GEMINI_API_KEY=your_google_generative_ai_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

   > **Note**: Get your `GEMINI_API_KEY` from [Google AI Studio](https://makersuite.google.com/app/apikey)

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
│   ├── components/     # Reusable services
│   │   ├── imageExtractor.js   # Web scraping for images
│   │   └── imageGenerator.js   # Placeholder & AI image generation
│   ├── config/         # DB connection
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth & error handlers
│   └── utils/          # Helper functions
├── frontend/           # React client
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context (Auth)
│   │   ├── assets/     # Images & static files
│   │   └── App.jsx     # Main app component
│   └── public/         # Static assets
└── .gitignore          # Root ignore file
```

---

## 🖼️ Image Handling

The app uses a smart two-tier image system:

### Automatic Image Extraction

When you add a product URL, the system automatically extracts the product image using **5-step strategy**:

1. **og:image Meta Tag** - Looks for OpenGraph image (most reliable)
2. **Data Attributes** - Searches for `data-main-image` (common on e-commerce)
3. **CSS Classes** - Finds `.product-image` or `.main-image` classes
4. **Keyword Matching** - Locates images with "product" in the URL
5. **Fallback** - Takes the first meaningful image found

### Image Resolution

- **Absolute URLs** → Used directly
- **Relative URLs** → Converted to absolute using the base domain
- **Extraction Fails** → Falls back to AI-generated placeholder

### AI Image Generation

If extraction fails or no URL is provided, the system can generate professional product images using:

- **Google Imagen-3.0**: Dedicated image generation model
- **Google Gemini-2.0-flash**: Generative model with image output

---

## 🧩 Backend Components

Located in `backend/components/`, these are reusable services for image handling:

- **imageExtractor.js** - Web scraping service that extracts product images from URLs with multiple fallback strategies
  - `extractImageFromUrl()` - Main extraction function
  - `resolveImageUrl()` - Converts relative URLs to absolute
  - `validateImageUrl()` - Checks if image is accessible

- **imageGenerator.js** - Image generation service
  - `generatePlaceholderImage()` - Creates styled placeholder using placehold.co
  - `generateImageWithGemini()` - Generates images using Google Gemini AI
  - `generateImageWithImagen()` - Generates images using Google Imagen AI
  - `createImagePrompt()` - Creates product-specific prompts

---

## 🧩 Frontend Components

The frontend uses reusable UI components located in `frontend/src/components/`:

- **FormInput** - Reusable input field with label and validation
- **ErrorMessage** - Error display component
- **LoadingSpinner** - Animated loading state
- **PrimaryButton** - Primary action button with animations
- **GlassButton** - Secondary glass-effect button

These components are used across pages like Login, Register, CreateWishlist, and WishlistDetail for consistent styling and reduced code duplication.

---

## � API Endpoints - Adding Items

### Add Item to Wishlist

**Endpoint**: `POST /api/wishlists/:wishlistId/items`

**Request Body**:

```json
{
  "name": "iPhone 15 Pro Max",
  "productLink": "https://amazon.com/Apple-iPhone-15-Pro-Max/dp/...",
  "description": "Optional description of the product"
}
```

**Response** (201 Created):

```json
{
  "_id": "item_id",
  "name": "iPhone 15 Pro Max",
  "productLink": "https://amazon.com/...",
  "description": "Optional description",
  "imageUrl": "https://example.com/product-image.jpg",
  "status": "available",
  "createdAt": "2026-04-24T10:30:00Z"
}
```

**Image Handling**:

- If `productLink` is provided: System automatically extracts the product image
- If no `productLink`: System generates a styled placeholder image
- If extraction fails: Placeholder is used as fallback

---

## �📝 Note on Requirements

Since this is a **Node.js** based project, dependencies are managed via `package.json` in both the `frontend` and `backend` folders.

There is **no `requirements.txt`** file needed as that is specific to Python projects. Simply run `npm install` in each directory to set up the environment.

---

## 📄 License

Distributed under the MIT License.
