# Picture It - Gamified Photo Location Guessing

A MERN stack social media application where users upload photos and others guess the location to earn points. Built with React, Redux Toolkit, Express, and MongoDB.

## Features

- **User Authentication**: Register, login, and profile management
- **Photo Upload**: Drag and drop photo uploads with difficulty levels
- **Location Guessing**: Interactive photo guessing with real-time scoring
- **Leaderboard**: Competitive rankings with time-based filters
- **User Profiles**: Personal statistics and profile customization
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Dropzone** - File uploads
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd picture-it
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `config.env` file in the root directory:
   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   API_BASE_URL=http://localhost:8080
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 8080) and React development server (port 3000).

### Alternative Commands

- **Backend only**: `npm run server`
- **Frontend only**: `npm run client`
- **Production build**: `npm run build`

## Project Structure

```
picture-it/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── src/
│   │   │   ├── components/    # Reusable components
│   │   │   ├── features/      # Redux slices
│   │   │   ├── pages/         # Page components
│   │   │   ├── store/         # Redux store
│   │   │   ├── App.js         # Main app component
│   │   │   └── index.js       # Entry point
│   │   └── package.json
│   ├── server/                # Express backend
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── uploads/          # File uploads
│   │   ├── index.js          # Server entry point
│   │   └── package.json
│   ├── config.env            # Environment variables
│   └── package.json          # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Photos
- `GET /api/photos` - Get all photos (excluding user's guesses)
- `POST /api/photos` - Upload a new photo
- `GET /api/photos/my-photos` - Get user's uploaded photos

### Guesses
- `POST /api/guesses` - Submit a guess
- `GET /api/guesses/my-guesses` - Get user's guesses

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

## Scoring System

- **Easy photos**: 5 base points
- **Medium photos**: 10 base points  
- **Hard photos**: 15 base points
- **Time bonus**: Up to 5 additional points for quick guesses
- **Photo uploads**: Earn points when others guess your photos correctly

## Features in Detail

### Photo Upload
- Drag and drop interface
- Multiple difficulty levels
- Automatic point assignment
- Image preview

### Location Guessing
- Real-time timer
- Case-insensitive matching
- Immediate feedback
- Skip functionality

### Leaderboard
- Time-based filtering (All time, Week, Month)
- User statistics
- Ranking system with medals

### User Profiles
- Editable profile information
- Personal statistics
- Activity tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the GitHub repository. 