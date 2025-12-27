# Frontend - Strava Year in Sport

React + Vite application for visualizing Strava running data.

## Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Axios**: HTTP client

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard view
│   ├── StoryCard.jsx           # SVG-based story visualization
│   ├── PreferencesPanel.jsx    # Customization sidebar
│   ├── LandingPage.jsx         # Landing/login page
│   └── ui/                     # Reusable UI components
├── config/
│   ├── storyPreferences.js     # Themes, schemas, defaults
│   └── index.js                # App configuration
├── hooks/
│   └── index.js                # Custom React hooks
├── services/
│   └── api.js                  # API client
├── App.jsx                     # Main app component
└── main.jsx                    # Entry point
```

## Key Components

### StoryCard
SVG-based visualization with:
- Dynamic grid layout for performance records
- Customizable themes
- Activity heatmap
- Quote section

### Dashboard
Main application view with:
- Stats overview
- Preferences panel
- Story preview
- Download functionality

### PreferencesPanel
Schema-driven customization UI for:
- Theme selection
- Section toggles
- Custom distance records
- Export format selection

## Development

```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:4000
```

## Customization

All themes and preferences are defined in `src/config/storyPreferences.js`. To add a new theme:

1. Add theme object to `THEME_PRESETS`
2. Define colors and gradients
3. Theme will automatically appear in preferences

## Export Functionality

- **SVG**: Direct SVG download
- **PNG**: Canvas-based rendering with image inlining
