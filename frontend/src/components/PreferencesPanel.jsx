import React, { useState } from 'react';
import { Settings, X, RotateCcw, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Card, Select, Toggle, Button } from './ui/index.jsx';
import {
    THEME_PRESETS,
    PREFERENCES_SCHEMA,
} from '../config/storyPreferences.js';

// ============================================================================
// Schema-driven field renderers
// ============================================================================

const FieldRenderers = {
    // Select dropdown renderer
    Select: ({ fieldKey, schema, value, onChange }) => (
        <Select
            value={value}
            onChange={(newValue) => onChange(fieldKey, newValue)}
            options={schema.options}
        />
    ),

    // Toggle group renderer (for sections)
    ToggleGroup: ({ schema, value, onUpdateSection }) => (
        <div className="space-y-3">
            {schema.options.map((option) => (
                <Toggle
                    key={option.id}
                    label={option.label}
                    checked={value?.[option.id] ?? option.defaultEnabled}
                    onChange={(checked) => onUpdateSection(option.id, checked)}
                    disabled={option.required}
                />
            ))}
        </div>
    ),

    // Theme picker with visual swatches (special case for better UX)
    ThemePicker: ({ value, onChange }) => (
        <div className="grid grid-cols-2 gap-2">
            {Object.values(THEME_PRESETS).map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => onChange('theme', theme.id)}
                    className={`
                        p-3 rounded-lg border text-left transition-all
                        ${value === theme.id
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-zinc-700 hover:border-zinc-600'
                        }
                    `}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.accent }}
                        />
                        <span className="text-xs font-medium text-white">
                            {theme.name}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    ),

    // Dynamic distance list manager
    DistanceList: ({ value, onChange }) => {
        const [newName, setNewName] = useState('');
        const [newKm, setNewKm] = useState('');

        const handleAdd = () => {
            if (!newName || !newKm) return;
            const newDist = {
                id: `pb_${Date.now()}`,
                name: newName,
                meters: parseFloat(newKm) * 1000,
                enabled: true
            };
            onChange('bestEffortDistances', [...(value || []), newDist]);
            setNewName('');
            setNewKm('');
        };

        const handleRemove = (id) => {
            onChange('bestEffortDistances', value.filter(d => d.id !== id));
        };

        const handleToggle = (id, enabled) => {
            onChange('bestEffortDistances', value.map(d => 
                d.id === id ? { ...d, enabled } : d
            ));
        };

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    {(value || []).map((dist) => (
                        <div key={dist.id} className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
                            <Toggle
                                hideLabel
                                checked={dist.enabled}
                                onChange={(checked) => handleToggle(dist.id, checked)}
                                size="sm"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{dist.name}</div>
                                <div className="text-[10px] text-zinc-500">{(dist.meters / 1000).toFixed(1)} km</div>
                            </div>
                            <button
                                onClick={() => handleRemove(dist.id)}
                                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pt-2 border-t border-zinc-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Label (e.g. 5K)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none"
                        />
                        <input
                            type="number"
                            placeholder="KM (e.g. 5)"
                            value={newKm}
                            onChange={(e) => setNewKm(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none"
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleAdd}
                        icon={Plus}
                        className="w-full text-xs py-1.5"
                    >
                        Add Record
                    </Button>
                </div>
            </div>
        );
    }
};

// ============================================================================
// Dynamic field renderer based on schema type
// ============================================================================

const renderField = (fieldKey, schema, preferences, onUpdatePreference, onUpdateSection) => {
    const value = preferences[fieldKey];

    // Special case: theme uses visual picker for better UX
    if (fieldKey === 'theme') {
        const ThemePicker = FieldRenderers.ThemePicker;
        return <ThemePicker
            value={value}
            onChange={onUpdatePreference}
        />;
    }

    // Special case: toggleGroup needs onUpdateSection
    if (schema.type === 'toggleGroup') {
        const ToggleGroup = FieldRenderers.ToggleGroup;
        return <ToggleGroup
            schema={schema}
            value={value}
            onUpdateSection={onUpdateSection}
        />;
    }

    // Get the appropriate renderer by capitalizing the type
    const rendererKey = schema.type.charAt(0).toUpperCase() + schema.type.slice(1);
    const Renderer = FieldRenderers[rendererKey];
    if (!Renderer) {
        console.warn(`No renderer for schema type: ${schema.type}`);
        return null;
    }

    return <Renderer
        fieldKey={fieldKey}
        schema={schema}
        value={value}
        onChange={onUpdatePreference}
    />;
};

// ============================================================================
// Collapsible Section Component
// ============================================================================

const CollapsibleSection = ({ id, title, isExpanded, onToggle, children }) => (
    <div className="border-b border-zinc-800 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
        <button
            onClick={() => onToggle(id)}
            className="w-full flex items-center justify-between text-sm font-semibold text-zinc-300 mb-3 hover:text-white transition-colors"
        >
            {title}
            {isExpanded ? (
                <ChevronUp size={16} className="text-zinc-500" />
            ) : (
                <ChevronDown size={16} className="text-zinc-500" />
            )}
        </button>
        {isExpanded && children}
    </div>
);

// ============================================================================
// Custom Quote Input (shown when quote === 'custom')
// ============================================================================

const CustomQuoteInput = ({ preferences, onUpdatePreference }) => (
    <div className="mt-3 space-y-2">
        <input
            type="text"
            placeholder="Your quote..."
            value={preferences.customQuote?.text || ''}
            onChange={(e) => onUpdatePreference('customQuote', {
                ...preferences.customQuote,
                text: e.target.value,
            })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
        />
        <input
            type="text"
            placeholder="Author (optional)"
            value={preferences.customQuote?.author || ''}
            onChange={(e) => onUpdatePreference('customQuote', {
                ...preferences.customQuote,
                author: e.target.value,
            })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
        />
    </div>
);

// ============================================================================
// Main PreferencesPanel Component
// ============================================================================

const PreferencesPanel = ({
    preferences,
    onUpdatePreference,
    onUpdateSection,
    onReset,
    isOpen = true,
    onToggle
}) => {
    // Define which schema fields to show and their order
    const visibleFields = ['theme', 'sections', 'bestEffortDistances', 'quote', 'layout', 'exportFormat'];

    // Track expanded state for each field
    const [expandedSections, setExpandedSections] = useState({
        theme: true,
        sections: true,
        bestEffortDistances: true,
        quote: false,
        layout: false,
        exportFormat: false,
    });

    const toggleSectionExpanded = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="fixed right-4 top-20 z-40 p-3 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors"
                title="Open Preferences"
            >
                <Settings size={20} className="text-zinc-400" />
            </button>
        );
    }

    return (
        <Card className="h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                    <Settings size={18} className="text-[#FC4C02]" />
                    Customize Story
                </h2>
                {onToggle && (
                    <button
                        onClick={onToggle}
                        className="p-1 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="space-y-0">
                {/* Dynamically render fields from PREFERENCES_SCHEMA */}
                {visibleFields.map((fieldKey) => {
                    const schema = PREFERENCES_SCHEMA[fieldKey];
                    if (!schema) return null;

                    return (
                        <CollapsibleSection
                            key={fieldKey}
                            id={fieldKey}
                            title={schema.label}
                            isExpanded={expandedSections[fieldKey]}
                            onToggle={toggleSectionExpanded}
                        >
                            {renderField(fieldKey, schema, preferences, onUpdatePreference, onUpdateSection)}

                            {/* Special case: show custom quote input */}
                            {fieldKey === 'quote' && preferences.quote === 'custom' && (
                                <CustomQuoteInput
                                    preferences={preferences}
                                    onUpdatePreference={onUpdatePreference}
                                />
                            )}
                        </CollapsibleSection>
                    );
                })}
            </div>

            {/* Reset Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                icon={RotateCcw}
                className="w-full mt-4"
            >
                Reset to Default
            </Button>
        </Card>
    );
};

export default PreferencesPanel;
