# Career Link

A full-stack professional networking app inspired by professional networks, built with React, Express.js, and MongoDB.

## Features

- User authentication (Sign up, Login)
- User profiles with education, experience, and skills
- Create and interact with posts
- Connection requests and networking
- Notifications
- Image uploads via Cloudinary

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables

The `.env` file is already created. You need to update it with your credentials:

#### MongoDB Setup

**Option A: MongoDB Atlas (Recommended for quick start)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` and `<dbname>` in the connection string
7. Update `MONGO_URI` in `.env` file

**Option B: Local MongoDB**

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use `MONGO_URI=mongodb://localhost:27017/career-link` in `.env`

#### Cloudinary Setup (for image uploads)

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your API Key, API Secret, and Cloud Name from the dashboard
4. Update the Cloudinary variables in `.env`

#### Mailtrap Setup (for emails - optional)

1. Go to [Mailtrap](https://mailtrap.io/)
2. Create a free account
3. Get your API token
4. Update `MAILTRAP_TOKEN` in `.env`

### 3. Update .env File

Edit the `.env` file in the root directory with your actual values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=yourverystrongsecret

NODE_ENV=development

MAILTRAP_TOKEN=your_mailtrap_token
EMAIL_FROM=mailtrap@demomailtrap.com
EMAIL_FROM_NAME=Career Link

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLIENT_URL=http://localhost:5173
```

**Important:** Replace all placeholder values with your actual credentials.

### 4. Run the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Production Mode

```bash
npm run build
npm start
```

## Quick Start (Minimal Setup)

If you just want to test the application quickly:

1. **MongoDB Atlas (Free - Recommended):**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a free cluster (M0 - Free tier)
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `career-link` or leave it
   - Update `MONGO_URI` in `.env` file

2. **Generate JWT Secret:**
   - Use any random string for `JWT_SECRET` (e.g., `mysecretkey123` or generate one online)
   - Update `JWT_SECRET` in `.env` file

3. **Skip Cloudinary and Mailtrap** (they're optional for basic functionality):
   - You can leave placeholder values for now
   - Image uploads won't work without Cloudinary
   - Email features won't work without Mailtrap

4. **Start the servers:**

   **Option A: Using the startup scripts (Easiest)**
   - Double-click `start-dev.bat` (Windows)
   - Or run `.\start-dev.ps1` in PowerShell
   
   **Option B: Manual start (Two terminals)**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - You should see the login page

## Project Structure

```
linkedin/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── lib/             # Utilities (DB, Cloudinary, Mailtrap)
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # API client
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── .env                 # Environment variables
```

## API Endpoints

- `/api/v1/auth` - Authentication (signup, login, logout)
- `/api/v1/users` - User operations
- `/api/v1/posts` - Post operations
- `/api/v1/connections` - Connection requests
- `/api/v1/notifications` - Notifications

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running (if using local)
- Verify the connection string in `.env`
- Ensure network access is configured in MongoDB Atlas

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change port in `vite.config.js` for frontend

### CORS Errors
- Ensure backend is running on port 5000
- Ensure frontend is running on port 5173
- Check `CLIENT_URL` in `.env`

## License

ISC
