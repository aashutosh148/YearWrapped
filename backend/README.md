# Backend - Strava Year in Sport

Node.js + Express API for Strava data aggregation and statistics.

## Tech Stack

- **Node.js + Express**: Server framework
- **MongoDB + Mongoose**: Database and ODM
- **Strava API**: Activity data source
- **JWT**: Authentication
- **Axios**: HTTP client

## Project Structure

```
src/
├── routes/
│   ├── activityRoutes.js    # Activity endpoints
│   ├── userRoutes.js        # User profile endpoints
│   └── authRoutes.js        # OAuth handlers
├── models/
│   ├── User.js              # User schema
│   └── UserActivity.js      # Activity schema
├── middleware/
│   └── auth.js              # JWT verification
├── utils/
│   ├── stats.js             # Statistics calculations
│   └── strava.js            # Strava API client
└── index.js                 # Server entry point
```

## API Endpoints

### Authentication
- `GET /auth/strava/login` - Initiate OAuth flow
- `GET /auth/strava/callback` - Handle OAuth callback

### User
- `GET /api/user/me` - Get current user
- `PATCH /api/user/preferences` - Update preferences

### Activities
- `GET /api/activities` - Get activities and stats
- `POST /api/activities/sync` - Sync from Strava

## Statistics Calculation

The `stats.js` utility provides:
- **Best Efforts**: Dynamic distance tracking
- **Heatmap**: Monthly activity intensity
- **Aggregations**: Total distance, time, activities

### Adding Custom Distances

Best efforts are calculated dynamically based on user preferences:

```javascript
const distances = [
  { id: 'pb5k', name: '5k', meters: 5000 },
  { id: 'pb10k', name: '10k', meters: 10000 }
];
const bestEfforts = getBestEfforts(activities, distances);
```

## Environment Variables

Create `.env` file:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/strava_stats
JWT_SECRET=your_secret_key
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REDIRECT_URI=http://localhost:4000/auth/strava/callback
FRONTEND_URL=http://localhost:5173
```

## Development

```bash
npm run dev  # Start with nodemon
npm start    # Start production server
```

## Database Schema

### User
- `stravaId`: Unique Strava athlete ID
- `name`, `firstname`, `lastname`: User info
- `avatar`: Profile picture URL
- `accessToken`, `refreshToken`: OAuth tokens
- `preferences`: User customization settings

### UserActivity
- `userId`: Reference to User
- `stravaId`: Unique activity ID
- `type`: Activity type (Run, Ride, etc.)
- `distance`, `moving_time`: Core metrics
- `raw`: Full Strava API response
