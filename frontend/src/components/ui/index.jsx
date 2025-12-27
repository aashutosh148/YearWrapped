/**
 * Reusable UI Components
 * 
 * Small, atomic components for consistent UI across the app.
 */

import React from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { APP_CONFIG } from '../../config/index.js';

// ============================================================================
// LoadingSpinner - Consistent loading indicator
// ============================================================================

export const LoadingSpinner = ({
    size = 'md',
    message = 'Loading...',
    showMessage = true,
    className = ''
}) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div
                className={`animate-spin rounded-full border-t-2 border-b-2 border-[${APP_CONFIG.colors.primary}] ${sizes[size]}`}
            />
            {showMessage && (
                <p className="text-zinc-400 text-sm animate-pulse">{message}</p>
            )}
        </div>
    );
};

// ============================================================================
// LoadingScreen - Full screen loading state
// ============================================================================

export const LoadingScreen = ({ message = 'Connecting to Strava...' }) => (
    <div className="min-h-screen bg-[#0F0F10] flex flex-col items-center justify-center text-white">
        <LoadingSpinner message={message} />
    </div>
);

// ============================================================================
// Logo - Consistent branding
// ============================================================================

export const Logo = ({ size = 'md', showText = true, className = '' }) => {
    const sizes = {
        sm: { icon: 16, text: 'text-base' },
        md: { icon: 18, text: 'text-lg' },
        lg: { icon: 24, text: 'text-xl' },
        xl: { icon: 32, text: 'text-2xl' },
    };

    const config = sizes[size] || sizes.md; // Fallback to md if invalid size

    return (
        <div className={`flex items-center gap-2 group cursor-pointer ${className}`}>
            <div className="bg-orange-600 p-1 rounded-md transition-colors group-hover:bg-orange-500">
                <Activity size={config.icon} className="text-white" strokeWidth={3} />
            </div>
            {showText && (
                <span className={`font-bold ${config.text} tracking-tight text-white`}>
                    Year<span className="text-orange-500">Wrapped</span>
                </span>
            )}
        </div>
    );
};

// ============================================================================
// FeatureCard - Card for landing page features
// ============================================================================

export const FeatureCard = ({ icon: Icon, title, description, className = '' }) => (
    <div className={`group p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-orange-500/30 transition-all duration-300 ${className}`}>
        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/10 transition-colors">
            <Icon className="text-zinc-400 group-hover:text-orange-500 transition-colors" size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
);

// ============================================================================
// Button - Consistent button styling
// ============================================================================

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'bg-[#FC4C02] hover:bg-orange-600 text-white shadow-lg shadow-orange-900/20 hover:shadow-orange-500/20',
        secondary: 'bg-white text-black hover:bg-zinc-200',
        outline: 'border border-zinc-700 hover:bg-zinc-800 text-white',
        ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800',
    };

    const sizes = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-sm',
        lg: 'py-4 px-10 text-lg',
    };

    return (
        <button
            disabled={disabled || isLoading}
            className={`
        flex items-center justify-center gap-2 rounded-xl font-bold 
        transition-all duration-200 transform hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={20} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={20} />}
                </>
            )}
        </button>
    );
};

// ============================================================================
// Badge - Status badges
// ============================================================================

export const Badge = ({ children, variant = 'default', pulse = false, className = '' }) => {
    const variants = {
        default: 'border-zinc-800 bg-zinc-900/50 text-zinc-400',
        success: 'border-green-800 bg-green-900/50 text-green-400',
        warning: 'border-orange-800 bg-orange-900/50 text-orange-400',
        error: 'border-red-800 bg-red-900/50 text-red-400',
    };

    return (
        <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full border 
      text-xs font-semibold uppercase tracking-wider
      hover:border-orange-500/50 hover:text-orange-500 transition-all cursor-default
      ${variants[variant]} ${className}
    `}>
            {pulse && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />}
            {children}
        </div>
    );
};

// ============================================================================
// Card - Container card
// ============================================================================

export const Card = ({ children, className = '', ...props }) => (
    <div
        className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 ${className}`}
        {...props}
    >
        {children}
    </div>
);

// ============================================================================
// Select - Dropdown select
// ============================================================================

export const Select = ({
    label,
    value,
    onChange,
    options,
    className = ''
}) => (
    <div className={className}>
        {label && (
            <label className="block text-sm font-medium text-zinc-400 mb-2">
                {label}
            </label>
        )}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

// ============================================================================
// Toggle - Toggle switch
// ============================================================================

export const Toggle = ({
    label,
    checked,
    onChange,
    disabled = false,
    className = ''
}) => (
    <label className={`flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <span className="text-sm text-zinc-300">{label}</span>
        <div className="relative">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => !disabled && onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
        </div>
    </label>
);

export default {
    LoadingSpinner,
    LoadingScreen,
    Logo,
    FeatureCard,
    Button,
    Badge,
    Card,
    Select,
    Toggle,
};
