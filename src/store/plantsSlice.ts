import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PlantState, PlantData } from '../types';
import { savePlantData as savePlantDataApi } from '../services/api';
import { getStoredPlants, saveStoredPlants } from '../utils/storage';

const initialState: PlantState = {
    plants: getStoredPlants(),
    loading: false,
    error: null,
    filter: 'all',
    userFilter: 'all',
};

/**
 * Async thunk to save new plant to backend and local storage
 */
export const saveNewPlant = createAsyncThunk(
    'plants/saveNewPlant',
    async (plant: PlantData) => {
        try {
            // Save to external API
            await savePlantDataApi(plant);
            return plant;
        } catch (error: any) {
            // Even if API fails, we can save locally
            console.warn('API save failed, saving locally only:', error.message);
            return plant; // Still return the plant to save locally
        }
    }
);

const plantsSlice = createSlice({
    name: 'plants',
    initialState,
    reducers: {
        deletePlant: (state, action: PayloadAction<string>) => {
            state.plants = state.plants.filter(p => p.imageUrl !== action.payload);
            saveStoredPlants(state.plants);
        },
        setFilter: (state, action: PayloadAction<PlantState['filter']>) => {
            state.filter = action.payload;
        },
        setUserFilter: (state, action: PayloadAction<PlantState['userFilter']>) => {
            state.userFilter = action.payload;
        },
        addPlantLocal: (state, action: PayloadAction<PlantData>) => {
            state.plants.push(action.payload);
            saveStoredPlants(state.plants);
        },
        clearAllPlants: (state) => {
            state.plants = [];
            saveStoredPlants([]);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveNewPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveNewPlant.fulfilled, (state, action) => {
                state.loading = false;
                state.plants.push(action.payload);
                // Persist to local storage
                saveStoredPlants(state.plants);
            })
            .addCase(saveNewPlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { deletePlant, setFilter, setUserFilter, addPlantLocal, clearAllPlants } = plantsSlice.actions;
export default plantsSlice.reducer;
