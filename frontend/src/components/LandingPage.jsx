import React, { useState } from 'react';
import { ArrowRight, Lock, Map, BarChart3, Share2 } from 'lucide-react';
import { Logo, Badge, Button, FeatureCard } from './ui/index.jsx';
import { APP_CONFIG, FEATURE_CARDS } from '../config/index.js';

// Icon mapping for dynamic feature cards
const ICONS = { Map, BarChart3, Share2 };

const LandingPage = ({ onConnect, isLoading = false, error = null }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">

            {/* Subtle Background Grid */}
            <div
                className="absolute inset-0 z-0 opacity-[0.05]"
                style={{
                    backgroundImage: 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
                <Logo size="md" />
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">

                {/* Hero Section */}
                <div className="flex flex-col items-center mb-24">

                    {/* Status Badge */}
                    <Badge pulse className="mb-8">
                        {APP_CONFIG.year} Engine Ready
                    </Badge>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-none text-white">
                        YOUR YEAR.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-orange-700">
                            UNWRAPPED.
                        </span>
                    </h1>

                    <p className="text-zinc-400 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                        Generate a professional data visualization of your {APP_CONFIG.year} Strava activities.
                        Minimalist, shareable, and detailed.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Primary CTA */}
                    <button
                        onClick={onConnect}
                        disabled={isLoading}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="group relative flex items-center gap-3 bg-[#FC4C02] hover:bg-orange-600 text-white font-bold text-lg py-4 px-10 rounded-xl transition-all duration-200 shadow-lg shadow-orange-900/20 hover:shadow-orange-500/20 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                        </svg>
                        {isLoading ? 'Connecting...' : 'Connect Strava'}
                        <ArrowRight size={20} className={`transition-transform duration-300 ${isHovered && !isLoading ? 'translate-x-1' : ''}`} />
                    </button>

                    {/* Privacy & T&C Notice */}
                    <div className="mt-6 max-w-md mx-auto space-y-2">
                        <p className="text-zinc-600 text-xs font-medium flex items-center justify-center gap-1">
                            <Lock size={10} className="inline" />
                            Secure OAuth connection. We do not store your data.
                        </p>
                        <p className="text-zinc-500 text-xs leading-relaxed">
                            By connecting, you agree to grant read-only access to your Strava activities. 
                            We only access your public profile and activity data to generate your year summary. 
                            No data is permanently stored on our servers.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {FEATURE_CARDS.filter(card => card.enabled).map((card) => {
                        const IconComponent = ICONS[card.icon];
                        return (
                            <FeatureCard
                                key={card.id}
                                icon={IconComponent}
                                title={card.title}
                                description={card.description}
                            />
                        );
                    })}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-900 py-10 text-center">
                <p className="text-zinc-600 text-sm">
                    {APP_CONFIG.footer.disclaimer}
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;