import type { PlantData } from '../types';

const STORAGE_KEY = 'farmgeo_plants';

export const getStoredPlants = (): PlantData[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
};

export const saveStoredPlants = (plants: PlantData[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const clearStoredPlants = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};
