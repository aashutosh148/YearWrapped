export const THEME_PRESETS = {
    dark: {
        id: 'dark',
        name: 'Dark (Default)',
        background: '#0F0F10',
        backgroundGradient: ['#1a1a1a', '#0F0F10'],
        accent: '#FC4C02',
        accentSecondary: '#FC4C02',
        text: '#FFFFFF',
        textSecondary: 'rgba(255,255,255,0.6)',
        textMuted: 'rgba(255,255,255,0.4)',
        cardBg: 'rgba(255,255,255,0.03)',
        cardBorder: 'rgba(255,255,255,0.1)', // This gives that nice subtle boundary
    },
    light: {
        id: 'light',
        name: 'Light',
        background: '#FAFBE9',              // Changed to White
        backgroundGradient: ['#F3F4F6', '#FFFFFF'], // Very subtle grey-to-white
        accent: '#FC4C02',                  // Keep Strava Orange
        accentSecondary: '#EA580C',         // Slightly darker orange for gradients
        text: '#18181B',                    // Dark Charcoal (not pure black, softer on eyes)
        textSecondary: 'rgba(24, 24, 27, 0.7)',
        textMuted: 'rgba(24, 24, 27, 0.5)',
        cardBg: '#F4F4F5',                  // Light Grey (Zinc-100) to separate from white bg
        cardBorder: '#E4E4E7',              // Distinct grey border for that "Inner Boundary"
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight Blue',
        background: '#0A1628',
        backgroundGradient: ['#0F2744', '#0A1628'],
        accent: '#3B82F6',
        accentSecondary: '#60A5FA',
        text: '#FFFFFF',
        textSecondary: 'rgba(255,255,255,0.6)',
        textMuted: 'rgba(255,255,255,0.4)',
        cardBg: 'rgba(255,255,255,0.03)',
        cardBorder: 'rgba(255,255,255,0.1)',
    },
    forest: {
        id: 'forest',
        name: 'Forest Green',
        background: '#0A1A0F',
        backgroundGradient: ['#142B1A', '#0A1A0F'],
        accent: '#22C55E',
        accentSecondary: '#4ADE80',
        text: '#FFFFFF',
        textSecondary: 'rgba(255,255,255,0.6)',
        textMuted: 'rgba(255,255,255,0.4)',
        cardBg: 'rgba(255,255,255,0.03)',
        cardBorder: 'rgba(255,255,255,0.1)',
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset',
        background: '#1A0A1A',
        backgroundGradient: ['#2D1B2D', '#1A0A1A'],
        accent: '#EC4899',
        accentSecondary: '#F472B6',
        text: '#FFFFFF',
        textSecondary: 'rgba(255,255,255,0.6)',
        textMuted: 'rgba(255,255,255,0.4)',
        cardBg: 'rgba(255,255,255,0.03)',
        cardBorder: 'rgba(255,255,255,0.1)',
    },
};

// ============================================================================
// LAYOUT OPTIONS - Different story layouts
// ============================================================================

export const LAYOUT_OPTIONS = {
    default: {
        id: 'default',
        name: 'Classic',
        description: 'Standard vertical layout',
    },
    compact: {
        id: 'compact',
        name: 'Compact',
        description: 'More data, less spacing',
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Key stats only',
    },
};

// ============================================================================
// SECTION VISIBILITY - Toggle story sections
// ============================================================================

export const STORY_SECTIONS = [
    {
        id: 'header',
        label: 'Year Header',
        defaultEnabled: true,
        required: true,
    },
    {
        id: 'avatar',
        label: 'Profile Picture',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'totals',
        label: 'Total Stats (Distance, Time, Activities)',
        defaultEnabled: true,
        required: true,
    },
    {
        id: 'pb5k',
        label: 'Best Effort: 5K',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'pb10k',
        label: 'Best Effort: 10K',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'pb20k',
        label: 'Best Effort: 20K',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'pbHalf',
        label: 'Best Effort: Half-Marathon',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'pbFull',
        label: 'Best Effort: Full Marathon',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'longestRun',
        label: 'Longest Run',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'heatmap',
        label: 'Activity Heatmap',
        defaultEnabled: true,
        required: false,
    },
    {
        id: 'quote',
        label: 'Motivational Quote',
        defaultEnabled: true,
        required: false,
    },
];

// ============================================================================
// QUOTES - Customizable quotes for story
// ============================================================================

export const QUOTE_OPTIONS = [
    {
        id: 'mountain',
        text: '"It\'s not the mountain we conquer, but ourselves."',
        author: 'Edmund Hillary',
    },
    {
        id: 'miles',
        text: '"The miracle isn\'t that I finished. It\'s that I had the courage to start."',
        author: 'John Bingham',
    },
    {
        id: 'limits',
        text: '"Your body can stand almost anything. It\'s your mind you have to convince."',
        author: 'Unknown',
    },
    {
        id: 'journey',
        text: '"Every step is progress, every mile is a victory."',
        author: 'Unknown',
    },
    {
        id: 'custom',
        text: '',
        author: '',
        isCustom: true,
    },
];

// ============================================================================
// EXPORT FORMAT OPTIONS
// ============================================================================

export const EXPORT_FORMATS = [
    {
        id: 'svg',
        name: 'SVG',
        description: 'Vector format, best quality',
        extension: '.svg',
        mimeType: 'image/svg+xml',
    },
    {
        id: 'png',
        name: 'PNG',
        description: 'Standard image format',
        extension: '.png',
        mimeType: 'image/png',
        // PNG export requires html2canvas or similar library
        requiresLibrary: true,
    },
];

// ============================================================================
// DEFAULT PREFERENCES - Initial state
// ============================================================================

export const DEFAULT_PREFERENCES = {
    theme: 'dark',
    layout: 'default',
    sections: STORY_SECTIONS.reduce((acc, section) => {
        acc[section.id] = section.defaultEnabled;
        return acc;
    }, {}),
    bestEffortDistances: [
        { id: 'pb5k', name: '5k', meters: 5000, enabled: true },
        { id: 'pb10k', name: '10k', meters: 10000, enabled: true },
        { id: 'pbHalf', name: 'Half-Marathon', meters: 21097.5, enabled: true },
        { id: 'pbFull', name: 'Marathon', meters: 42195, enabled: true }
    ],
    quote: 'mountain',
    customQuote: { text: '', author: '' },
    exportFormat: 'svg',
    showBranding: true,
};

// ============================================================================
// PREFERENCES SCHEMA - For validation and UI generation
// ============================================================================

export const PREFERENCES_SCHEMA = {
    theme: {
        type: 'select',
        label: 'Color Theme',
        options: Object.values(THEME_PRESETS).map(t => ({ value: t.id, label: t.name })),
    },
    layout: {
        type: 'select',
        label: 'Layout Style',
        options: Object.values(LAYOUT_OPTIONS).map(l => ({
            value: l.id,
            label: l.name,
            description: l.description
        })),
    },
    sections: {
        type: 'toggleGroup',
        label: 'Sections to Include',
        options: STORY_SECTIONS,
    },
    quote: {
        type: 'select',
        label: 'Quote',
        options: QUOTE_OPTIONS.map(q => ({
            value: q.id,
            label: q.isCustom ? 'Custom Quote' : q.text.slice(0, 40) + '...'
        })),
    },
    exportFormat: {
        label: 'Download Format',
        type: 'select',
        options: [
            { id: 'svg', label: 'SVG (Vector)' },
            { id: 'png', label: 'PNG (Image)' },
        ],
    },
    bestEffortDistances: {
        label: 'Performance Records',
        type: 'distanceList',
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getTheme = (themeId) => THEME_PRESETS[themeId] || THEME_PRESETS.dark;
export const getLayout = (layoutId) => LAYOUT_OPTIONS[layoutId] || LAYOUT_OPTIONS.default;
export const getQuote = (quoteId) => QUOTE_OPTIONS.find(q => q.id === quoteId) || QUOTE_OPTIONS[0];
export const getExportFormat = (formatId) => EXPORT_FORMATS.find(f => f.id === formatId) || EXPORT_FORMATS[0];

export default {
    THEME_PRESETS,
    LAYOUT_OPTIONS,
    STORY_SECTIONS,
    QUOTE_OPTIONS,
    EXPORT_FORMATS,
    DEFAULT_PREFERENCES,
    PREFERENCES_SCHEMA,
    getTheme,
    getLayout,
    getQuote,
    getExportFormat,
};
