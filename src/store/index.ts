import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from './uploadSlice';
import plantsReducer from './plantsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
    reducer: {
        upload: uploadReducer,
        plants: plantsReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore File objects in the upload state
                ignoredActions: ['upload/setFile'],
                ignoredPaths: ['upload.file'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
