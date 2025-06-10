# Picture It

A gamified social media app where users upload photos and others guess the location to earn points. Built with Next.js, Express, and MongoDB.

## Features
- User authentication (register, login, logout)
- Upload travel photos with location metadata
- Guess the location of photos uploaded by others
- Earn points for correct guesses
- Leaderboard and user profiles
- Modern UI with Tailwind CSS

## Getting Started

### 1. Install dependencies
```
npm install
```

### 2. Configure Environment Variables
Copy the example config file and update it with your values:
```bash
cp config.env.example config.env
```

Edit `config.env` with your configuration:
- **MongoDB URI**: Your MongoDB connection string
- **JWT Secret**: A secure random string for JWT tokens
- **Cloudinary**: Your Cloudinary credentials (for image uploads)
- **Ports**: Server and frontend ports

### 3. Start the Development Servers

**Option A: Run both servers together**
```bash
npm run dev:full
```

**Option B: Run servers separately**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

- The frontend will be available at `http://localhost:3000`
- The backend API will run at `http://localhost:8080`

### 4. Database Setup

**Local MongoDB (Recommended for development):**
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community
```

**MongoDB Atlas (Cloud):**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Add your IP to the whitelist
3. Update `MONGODB_URI` in `config.env`

## Project Structure
```
/server         # Express backend (API, models, routes)
/app            # Next.js frontend (pages, components, contexts)
/public         # Static assets (favicon, images, etc.)
config.env      # Environment configuration
```

## Configuration

The `config.env` file contains all environment variables:

- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Secret for JWT token signing
- `CLOUDINARY_*`: Cloudinary credentials for image uploads
- `PORT`: Backend server port
- `FRONTEND_URL`: Frontend URL for CORS
- `API_BASE_URL`: Backend API URL

## License
MIT 