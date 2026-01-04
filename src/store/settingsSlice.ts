import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppSettings } from '../types';

const getStoredSettings = (): AppSettings => {
    try {
        const stored = localStorage.getItem('farmgeo_settings');
        if (stored) {
            const parsed = JSON.parse(stored);
            return { ...parsed, theme: 'light' }; // Force light theme
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
    return {
        theme: 'light',
        mapStyle: 'standard',
        notifications: true,
        language: 'en',
        currentUserEmail: '',
    };
};

const saveSettings = (settings: AppSettings) => {
    try {
        localStorage.setItem('farmgeo_settings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
};

const initialState: AppSettings = getStoredSettings();

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state) => {
            state.theme = 'light'; // Always force light
            saveSettings(state);
            // Ensure dark mode is removed
            document.documentElement.classList.remove('dark');
        },
        setMapStyle: (state, action: PayloadAction<'standard' | 'satellite'>) => {
            state.mapStyle = action.payload;
            saveSettings(state);
        },
        toggleNotifications: (state) => {
            state.notifications = !state.notifications;
            saveSettings(state);
        },
        setLanguage: (state, action: PayloadAction<'en' | 'hi' | 'mr'>) => {
            state.language = action.payload;
            saveSettings(state);
        },
        setCurrentUserEmail: (state, action: PayloadAction<string>) => {
            state.currentUserEmail = action.payload;
            saveSettings(state);
        },
    },
});

export const { setTheme, setMapStyle, toggleNotifications, setLanguage, setCurrentUserEmail } = settingsSlice.actions;
export default settingsSlice.reducer;
