export const APP_CONFIG = {
    // App Info
    name: 'YearWrapped',
    tagline: 'Your Year. Unwrapped.',
    year: new Date().getFullYear(),

    // Theme Colors
    colors: {
        primary: '#FC4C02',      // Strava Orange
        primaryHover: '#E54502',
        background: '#0F0F10',
        surface: '#18181B',
        surfaceHover: '#27272A',
        border: '#27272A',
        text: {
            primary: '#FFFFFF',
            secondary: '#A1A1AA',
            muted: '#71717A',
        },
    },

    // Feature Flags - Enable/disable features easily
    features: {
        showHeatmap: true,
        showPersonalBests: true,
        showLongestRun: true,
        showQuote: true,
        enableDownload: true,
        enableSharing: true,
        showDebugPanel: true, // Show JSON stats in dashboard
    },

    // Navigation Links
    navLinks: [
        { label: 'Samples', href: '#samples' },
        { label: 'Privacy', href: '#privacy' },
    ],

    // Social/Footer
    footer: {
        disclaimer: 'Powered by the Strava API • Not affiliated with Strava, Inc.',
    },
};

// Feature cards for landing page - easily extensible
export const FEATURE_CARDS = [
    {
        id: 'heatmaps',
        icon: 'Map',
        title: 'Route Heatmaps',
        description: 'High-contrast visualizations of every street you conquered.',
        enabled: true,
    },
    {
        id: 'stats',
        icon: 'BarChart3',
        title: 'Key Metrics',
        description: 'Elevation gain, total distance, and PRs formatted for easy reading.',
        enabled: true,
    },
    {
        id: 'sharing',
        icon: 'Share2',
        title: 'Insta-Ready',
        description: 'Export 9:16 vertical images perfectly sized for your Story or Status.',
        enabled: true,
    },
];

export default APP_CONFIG;
