# Strava Year in Sport

A beautiful, customizable year-in-review visualization for your Strava running data.

## Features

- **Dynamic Performance Records**: Track any distance (5k, 10k, Marathon, or custom)
- **Adaptive Grid Layout**: Automatically adjusts to display all your achievements
- **Multiple Export Formats**: Download as SVG (vector) or PNG (image)
- **Customizable Themes**: Dark, Light, Sunset, Midnight Blue, Forest Green
- **Run-Only Statistics**: Focused exclusively on running activities
- **Activity Heatmap**: Visual representation of your training consistency

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS (utility-first styling)
- Lucide React (icons)
- SVG-based visualization

### Backend
- Node.js + Express
- MongoDB (data storage)
- Strava API integration
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or remote)
- Strava API credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd strava_2025
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables:

**Backend** (`backend/.env`):
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/strava_stats
JWT_SECRET=your_jwt_secret
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REDIRECT_URI=http://localhost:4000/auth/strava/callback
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:4000
```

4. Start the development servers:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - MongoDB (if local)
mongosh
```

5. Open http://localhost:5173 and connect with Strava!

## Project Structure

```
strava_2025/
├── backend/
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # MongoDB schemas
│   │   ├── middleware/    # Auth, error handling
│   │   ├── utils/         # Stats calculations
│   │   └── index.js       # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # Themes, preferences
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client
│   │   └── App.jsx        # Main app component
│   └── package.json
└── README.md
```

## Customization

### Adding Custom Distances
1. Open the Preferences Panel in the dashboard
2. Navigate to "Performance Records"
3. Enter a label (e.g., "5K") and distance in kilometers
4. Click "Add Record"
5. Click "Regenerate Stats" to calculate your best time

### Changing Themes
Select from 5 built-in themes in the Preferences Panel:
- Dark (default)
- Light
- Sunset
- Midnight Blue
- Forest Green

### Export Options
- **SVG**: Vector format, perfect for editing or printing
- **PNG**: High-quality image (1080x1920), ready for social media

## API Endpoints

### Authentication
- `GET /auth/strava/login` - Initiate Strava OAuth
- `GET /auth/strava/callback` - OAuth callback handler

### User
- `GET /api/user/me` - Get current user profile
- `PATCH /api/user/preferences` - Update user preferences

### Activities
- `GET /api/activities` - Get activities and stats
- `POST /api/activities/sync` - Sync latest activities from Strava

## Contributing

Contributions are welcome! Please follow these guidelines:
- Use 2-space indentation
- Follow existing code style
- Remove trivial comments (code should be self-documenting)
- Test your changes before submitting

## License

MIT

## Acknowledgments

- Strava API for activity data
- React and Vite communities
- All contributors to this project
