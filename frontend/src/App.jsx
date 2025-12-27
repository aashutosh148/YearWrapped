import { useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import { LoadingScreen, Logo, Button } from './components/ui/index.jsx';
import { useAuth, useStravaData, useStoryPreferences } from './hooks/index.js';

const VIEWS = {
    LANDING: 'landing',
    DASHBOARD: 'dashboard', 
};

const App = () => {
    const auth = useAuth();
    const stravaData = useStravaData();
    const storyPreferences = useStoryPreferences();

    // Fetch data only once when authenticated
    useEffect(() => {
        if (auth.isAuthenticated && !stravaData.data && !stravaData.isLoading) {
            stravaData.fetchData().then(data => {
                // Sync preferences from backend if they exist
                if (data?.preferences && Object.keys(data.preferences).length > 0) {
                    storyPreferences.setPreferences(prev => ({
                        ...prev,
                        ...data.preferences
                    }));
                }
            }).catch(err => {
                console.error('Initial data fetch failed:', err);
            });
        }
    }, [auth.isAuthenticated, stravaData.data, stravaData.isLoading, stravaData.fetchData, storyPreferences.setPreferences]);

    // Handle logout
    const handleLogout = async () => {
        await auth.logout();
    };

    // 1. Error state
    if (auth.error || stravaData.error) {
        return (
            <div className="min-h-screen bg-[#0F0F10] text-white flex flex-col items-center justify-center p-6 text-center">
                <Logo size="xl" className="mb-8" />
                <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                <p className="text-zinc-400 max-w-md mb-8">
                    {auth.error || stravaData.error}
                </p>
                <Button onClick={() => window.location.href = '/'}>
                    Try Again
                </Button>
            </div>
        );
    }

    // 2. Loading state
    if (auth.isLoading || (auth.isAuthenticated && stravaData.isLoading && !stravaData.data)) {
        return <LoadingScreen message={auth.isLoading ? 'Authenticating...' : 'Loading your year in sport...'} />;
    }

    // 3. Authenticated Dashboard
    if (auth.isAuthenticated && stravaData.data) {
        return (
            <Dashboard
                data={stravaData.data}
                onLogout={handleLogout}
                onRefresh={stravaData.refreshStats}
                isRefreshing={stravaData.isLoading}
                preferences={storyPreferences.preferences}
                theme={storyPreferences.theme}
                quote={storyPreferences.quote}
                onUpdatePreference={storyPreferences.updatePreference}
                onUpdateSection={storyPreferences.updateSection}
                onResetPreferences={storyPreferences.resetPreferences}
            />
        );
    }

    // 4. Default Landing Page
    return (
        <LandingPage
            onConnect={auth.connect}
            isLoading={auth.isLoading}
            error={auth.error}
        />
    );
};

export default App;