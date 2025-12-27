import React, { useState } from 'react';
import { Zap, Download, RefreshCw, LogOut, Settings } from 'lucide-react';
import StoryCard from './StoryCard.jsx';
import PreferencesPanel from './PreferencesPanel.jsx';
import { Logo, Card, Button } from './ui/index.jsx';
import { useDownload } from '../hooks/index.js';
import { APP_CONFIG } from '../config/index.js';

const Dashboard = ({
    data,
    onLogout,
    onRefresh,
    isRefreshing = false,
    // Preferences props
    preferences,
    theme,
    quote,
    onUpdatePreference,
    onUpdateSection,
    onResetPreferences,
}) => {
    const [showPreferences, setShowPreferences] = useState(true);
    const { downloadSvg, downloadPng, isDownloading } = useDownload();

    const handleDownload = async () => {
        const filename = `strava-wrapped-${data.stats.year}`;
        if (preferences.exportFormat === 'png') {
            await downloadPng('story-svg', filename);
        } else {
            downloadSvg('story-svg', filename);
        }
    };

    const handleRefresh = async () => {
        try {
            await onRefresh();
        } catch (err) {
            // Error handled by hook
            console.error('Refresh failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F10] text-white flex flex-col">
            {/* Navigation */}
            <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo size="md" />

                    <div className="flex items-center gap-4">
                        {/* Preferences Toggle (Mobile) */}
                        <button
                            onClick={() => setShowPreferences(!showPreferences)}
                            className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
                            title="Toggle Preferences"
                        >
                            <Settings size={20} />
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 bg-zinc-800 py-1.5 px-3 rounded-full border border-zinc-700">
                            {data.user?.avatar && (
                                <img
                                    src={data.user.avatar}
                                    alt="Profile"
                                    className="w-6 h-6 rounded-full"
                                />
                            )}
                            <span className="text-sm font-medium text-zinc-300 hidden sm:block">
                                {data.user?.name || data.user?.firstname || 'Athlete'}
                            </span>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={onLogout}
                            className="p-2 text-zinc-500 hover:text-white transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar - Preferences & Stats */}
                <div className="w-full lg:w-1/3 space-y-6">

                    {/* Preferences Panel - Now first */}
                    <div className={`${showPreferences ? 'block' : 'hidden'} lg:block`}>
                        <PreferencesPanel
                            preferences={preferences}
                            onUpdatePreference={onUpdatePreference}
                            onUpdateSection={onUpdateSection}
                            onReset={onResetPreferences}
                            isOpen={true}
                        />
                    </div>

                    {/* Stats Card - Now second */}
                    {APP_CONFIG.features.showDebugPanel && (
                        <Card>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="text-[#FC4C02]" size={20} />
                                Your Running Stats
                            </h2>
                            
                            {/* Stats Table */}
                            <div className="space-y-4 mb-6">
                                {/* Overview Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                                        <div className="text-xs text-zinc-500 mb-1">Total Distance</div>
                                        <div className="text-lg font-bold text-white">{data.stats.totalDistance} km</div>
                                    </div>
                                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                                        <div className="text-xs text-zinc-500 mb-1">Total Time</div>
                                        <div className="text-lg font-bold text-white">{data.stats.totalTime}</div>
                                    </div>
                                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                                        <div className="text-xs text-zinc-500 mb-1">Activities</div>
                                        <div className="text-lg font-bold text-white">{data.stats.totalActivities}</div>
                                    </div>
                                    <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                                        <div className="text-xs text-zinc-500 mb-1">Longest Run</div>
                                        <div className="text-lg font-bold text-white">{data.stats.longestRun?.distance}</div>
                                    </div>
                                </div>

                                {/* Best Efforts */}
                                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                                    <div className="text-sm font-semibold text-zinc-400 mb-3">Best Efforts</div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {preferences.bestEffortDistances && preferences.bestEffortDistances
                                            .filter(d => d.enabled)
                                            .map((distance) => (
                                                <div key={distance.id} className="flex justify-between">
                                                    <span className="text-zinc-500">{distance.name}:</span>
                                                    <span className="text-white font-mono">
                                                        {data.stats.bestEfforts?.[distance.id] || '-'}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    isLoading={isRefreshing}
                                    icon={RefreshCw}
                                    className="w-full"
                                >
                                    Regenerate Stats
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleDownload}
                                    isLoading={isDownloading}
                                    icon={Download}
                                    className="w-full"
                                >
                                    Download Story ({preferences.exportFormat?.toUpperCase() || 'SVG'})
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Share Prompt */}
                    <div className="bg-[#FC4C02]/10 border border-[#FC4C02]/20 rounded-2xl p-6">
                        <h3 className="text-[#FC4C02] font-bold mb-2">Ready to Share?</h3>
                        <p className="text-sm text-zinc-400">
                            Download and upload directly to Instagram Stories. Tag #StravaWrapped!
                        </p>
                    </div>
                </div>

                {/* Right Side - Story Preview */}
                <div className="w-full lg:w-2/3 flex items-start justify-center bg-zinc-900/30 rounded-[40px] border border-zinc-800 p-8 pt-8">
                    <div
                        className="relative shadow-2xl rounded-3xl overflow-hidden"
                        style={{ width: '100%', maxWidth: '600px' }}
                    >
                        <StoryCard
                            data={data}
                            id="story-svg"
                            theme={theme}
                            quote={quote}
                            sections={preferences.sections}
                            bestEffortDistances={preferences.bestEffortDistances}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;