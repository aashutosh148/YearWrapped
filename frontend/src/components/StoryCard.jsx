import { getTheme, getQuote, DEFAULT_PREFERENCES } from '../config/storyPreferences.js';

// Default theme for fallback
const DEFAULT_THEME = getTheme('dark');

const StoryCard = ({
    data,
    id,
    theme = DEFAULT_THEME,
    quote = getQuote('mountain'),
    sections = DEFAULT_PREFERENCES.sections,
    bestEffortDistances = DEFAULT_PREFERENCES.bestEffortDistances
}) => {
    const { stats } = data;

    // Use provided theme or fallback
    const t = theme || DEFAULT_THEME;
    const q = quote || getQuote('mountain');

    // Month names for heatmap
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    // --- Dynamic Records Grid Logic ---
    const activeRecords = (bestEffortDistances || [])
        .filter(d => d.enabled)
        .map(d => ({
            ...d,
            value: stats.bestEfforts?.[d.id] || stats[d.id] || "-"
        }));

    const numRecords = activeRecords.length;
    const cols = numRecords <= 3 ? numRecords : (numRecords === 4 ? 2 : 3);
    const rows = Math.ceil(numRecords / cols);
    
    // Grid sizing
    const cardWidth = 920;
    const gridX = 80;
    const gridY = 780;
    const cellWidth = cardWidth / cols;
    const cellHeight = 160;
    const sectionHeight = Math.max(320, rows * cellHeight + 100);

    return (
        <svg
            id={id}
            viewBox="0 0 1080 1920"
            className="w-full h-full shadow-2xl rounded-3xl select-none"
            style={{ maxHeight: '80vh', aspectRatio: '9/16' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={t.backgroundGradient[0]} />
                    <stop offset="100%" stopColor={t.backgroundGradient[1]} />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="1080" height="1920" fill={t.background} />
            <circle cx="1080" cy="0" r="600" fill={t.accent} fillOpacity="0.05" />
            <circle cx="0" cy="1920" r="800" fill={t.accent} fillOpacity="0.08" />

            {/* Header Section */}
            {sections.header && (
                <g>
                    <text
                        fill={t.text}
                        fontFamily="sans-serif"
                        fontSize="32"
                        fontWeight="600"
                        letterSpacing="0.2em"
                        opacity="0.5"
                        x="80"
                        y="120"
                    >
                        {stats.year} RUNNING YEAR
                    </text>
                    <text
                        fill={t.text}
                        fontFamily="sans-serif"
                        fontSize="84"
                        fontWeight="800"
                        letterSpacing="-0.02em"
                        x="80"
                        y="220"
                    >
                        {(data.user?.firstname + ' ' + data.user?.lastname || 'ATHLETE').toUpperCase()}
                    </text>

                    {/* Avatar */}
                    {sections.avatar && data.user?.avatar && (
                        <g transform="translate(850, 80)">
                            <defs>
                                <clipPath id={`avatarClip_${id || 'main'}`}>
                                    <circle cx="75" cy="75" r="75" />
                                </clipPath>
                            </defs>
                            <image
                                href={data.user.avatar}
                                width="150"
                                height="150"
                                clipPath={`url(#avatarClip_${id || 'main'})`}
                                preserveAspectRatio="xMidYMid slice"
                                crossOrigin="anonymous"
                            />
                            <circle cx="75" cy="75" r="75" fill="none" stroke={t.accent} strokeWidth="4" />
                        </g>
                    )}
                </g>
            )}

            {/* Main Totals Section */}
            {sections.totals && (
                <g transform="translate(80, 420)">
                    <text
                        fill={t.accent}
                        fontFamily="sans-serif"
                        fontSize="140"
                        fontWeight="900"
                        letterSpacing="-0.04em"
                        x="0"
                        y="100"
                    >
                        {stats.totalDistance}
                    </text>
                    <text
                        fill={t.text}
                        fontFamily="sans-serif"
                        fontSize="28"
                        fontWeight="600"
                        letterSpacing="0.1em"
                        opacity="0.6"
                        x="5"
                        y="150"
                    >
                        TOTAL KILOMETERS
                    </text>

                    <g transform="translate(0, 240)">
                        <text fill={t.text} fontFamily="sans-serif" fontSize="64" fontWeight="800" x="0" y="0">
                            {stats.totalActivities}
                        </text>
                        <text fill={t.text} fontFamily="sans-serif" fontSize="20" fontWeight="600" opacity="0.5" x="0" y="40">
                            ACTIVITIES
                        </text>

                        <text fill={t.text} fontFamily="sans-serif" fontSize="64" fontWeight="800" x="450" y="0">
                            {stats.totalTime}
                        </text>
                        <text fill={t.text} fontFamily="sans-serif" fontSize="20" fontWeight="600" opacity="0.5" x="450" y="40">
                            TOTAL TIME
                        </text>
                    </g>
                </g>
            )}

            {/* Dynamic Records Section */}
            {numRecords > 0 && (
                <g>
                    <rect
                        x={gridX}
                        y={gridY}
                        width={cardWidth}
                        height={sectionHeight}
                        rx="40"
                        fill={t.cardBg}
                        stroke={t.cardBorder}
                    />
                    <text
                        fill={t.text}
                        fontFamily="sans-serif"
                        fontSize="24"
                        fontWeight="700"
                        letterSpacing="0.1em"
                        opacity="0.4"
                        x={gridX + 40}
                        y={gridY + 60}
                    >
                        BEST EFFORTS
                    </text>

                    <g fontFamily="sans-serif" fontWeight="700">
                        {activeRecords.map((record, index) => {
                            const col = index % cols;
                            const row = Math.floor(index / cols);
                            const x = gridX + col * cellWidth + cellWidth / 2;
                            const y = gridY + 140 + row * cellHeight;

                            return (
                                <g key={record.id} transform={`translate(${x}, ${y})`}>
                                    <text
                                        fill={t.text}
                                        fontSize="24"
                                        opacity="0.5"
                                        textAnchor="middle"
                                        y="-10"
                                    >
                                        {record.name.toUpperCase()}
                                    </text>
                                    <text
                                        fill={t.text}
                                        fontSize="44"
                                        textAnchor="middle"
                                        y="45"
                                    >
                                        {record.value}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </g>
            )}

            {/* Longest Run Section */}
            {sections.longestRun && (
                <g transform={`translate(80, ${gridY + sectionHeight + 40})`}>
                    <text
                        fill={t.text}
                        fontFamily="sans-serif"
                        fontSize="24"
                        fontWeight="700"
                        opacity="0.4"
                        letterSpacing="0.1em"
                        x="0"
                        y="0"
                    >
                        LONGEST RUN
                    </text>
                    <text fill={t.text} fontFamily="sans-serif" fontSize="52" fontWeight="800" x="0" y="70">
                        {stats.longestRun.distance}
                    </text>
                    <text fill={t.accent} fontFamily="sans-serif" fontSize="24" fontWeight="600" x="260" y="65">
                        {stats.longestRun.date}
                    </text>
                </g>
            )}


            {/* Heatmap Section - Now comes first */}
            {sections.heatmap && (
                <g>
                    <text
                        fill={t.text}
                        fontFamily="sans-serif"
                        fontSize="24"
                        fontWeight="700"
                        opacity="0.4"
                        letterSpacing="0.1em"
                        x="80"
                        y={gridY + sectionHeight + 180}
                    >
                        ACTIVITY HEATMAP
                    </text>
                    <g transform={`translate(80, ${gridY + sectionHeight + 220})`}>
                        {stats.heatmap.map((intensity, index) => {
                            const col = index % 6;
                            const row = Math.floor(index / 6);
                            const x = col * 155;
                            const y = row * 165;

                            return (
                                <g key={index}>
                                    <rect
                                        x={x}
                                        y={y}
                                        width="135"
                                        height="135"
                                        rx="20"
                                        fill={t.accent}
                                        fillOpacity={0.1 + (intensity * 0.9)}
                                    />
                                    <text
                                        x={x + 67}
                                        y={y + 160}
                                        textAnchor="middle"
                                        fontSize="18"
                                        fill={t.text}
                                        opacity="0.3"
                                        fontWeight="600"
                                    >
                                        {monthNames[index]}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </g>
            )}

            {/* Quote Section - Now at bottom, smaller */}
            {sections.quote && q && q.text && (
                <text
                    fill={t.text}
                    fontFamily="sans-serif"
                    fontSize="28"
                    fontStyle="italic"
                    fontWeight="400"
                    textAnchor="middle"
                    opacity="0.7"
                >
                    <tspan x="540" y={gridY + sectionHeight + 620}>"{q.text.split('\n')[0] || q.text}"</tspan>
                    {q.author && (
                        <tspan x="540" y={gridY + sectionHeight + 665} fontSize="20" opacity="0.4">— {q.author}</tspan>
                    )}
                </text>
            )}

            {/* Footer/Branding */}
        </svg>
    );
};

export default StoryCard;