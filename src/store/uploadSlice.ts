import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UploadState, FileUploadItem } from '../types';
import { uploadToCloudinary, extractGeolocation } from '../services/api';

const initialState: UploadState = {
    files: [],
    overallStatus: 'idle',
    error: null,
};

/**
 * Async thunk to upload a single image and extract geolocation
 */
export const uploadSingleImage = createAsyncThunk(
    'upload/uploadSingleImage',
    async ({ file, email, index }: { file: File; email: string; index: number }, { rejectWithValue }) => {
        try {
            // Step 1: Upload to Cloudinary
            const { url, originalname } = await uploadToCloudinary(file);

            // Step 2: Extract Geolocation from backend API
            const location = await extractGeolocation(url, originalname, email);

            return {
                index,
                url,
                location,
            };
        } catch (error: any) {
            return rejectWithValue({ index, error: error.message || 'Upload failed' });
        }
    }
);

/**
 * Async thunk to upload multiple images in batch
 */
export const uploadBatchImages = createAsyncThunk(
    'upload/uploadBatchImages',
    async ({ email }: { email: string }, { getState, dispatch }) => {
        const state = getState() as { upload: UploadState };
        const files = state.upload.files;

        // Upload all files concurrently
        const uploadPromises = files.map((_, index) =>
            dispatch(uploadSingleImage({ file: files[index].file, email, index }))
        );

        await Promise.all(uploadPromises);
        return true;
    }
);

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        addFiles: (state, action: PayloadAction<File[]>) => {
            const newFiles: FileUploadItem[] = action.payload.map(file => ({
                file,
                previewUrl: URL.createObjectURL(file),
                status: 'idle' as const,
                progress: 0,
                error: null,
                uploadedImageUrl: null,
                extractedLocation: null,
                health: 'healthy' as const, // Default health status
            }));
            state.files = [...state.files, ...newFiles];
            state.overallStatus = 'idle';
            state.error = null;
        },
        removeFile: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            if (state.files[index]?.previewUrl) {
                URL.revokeObjectURL(state.files[index].previewUrl);
            }
            state.files.splice(index, 1);
            if (state.files.length === 0) {
                state.overallStatus = 'idle';
            }
        },
        clearAllFiles: (state) => {
            state.files.forEach(item => {
                if (item.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            });
            state.files = [];
            state.overallStatus = 'idle';
            state.error = null;
        },
        updateFileProgress: (state, action: PayloadAction<{ index: number; progress: number }>) => {
            const { index, progress } = action.payload;
            if (state.files[index]) {
                state.files[index].progress = progress;
            }
        },
        updateFileHealth: (state, action: PayloadAction<{ index: number; health: 'healthy' | 'warning' | 'critical' }>) => {
            const { index, health } = action.payload;
            if (state.files[index]) {
                state.files[index].health = health;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Batch upload
            .addCase(uploadBatchImages.pending, (state) => {
                state.overallStatus = 'uploading';
                state.error = null;
                state.files.forEach(file => {
                    file.status = 'uploading';
                    file.progress = 0;
                });
            })
            .addCase(uploadBatchImages.fulfilled, (state) => {
                state.overallStatus = 'success';
            })
            .addCase(uploadBatchImages.rejected, (state, action) => {
                state.overallStatus = 'error';
                state.error = action.error.message || 'Batch upload failed';
            })
            // Single image upload
            .addCase(uploadSingleImage.pending, (state, action) => {
                const index = action.meta.arg.index;
                if (state.files[index]) {
                    state.files[index].status = 'uploading';
                    state.files[index].progress = 0;
                }
            })
            .addCase(uploadSingleImage.fulfilled, (state, action) => {
                const { index, url, location } = action.payload;
                if (state.files[index]) {
                    state.files[index].status = 'success';
                    state.files[index].uploadedImageUrl = url;
                    state.files[index].extractedLocation = location;
                    state.files[index].progress = 100;
                }
            })
            .addCase(uploadSingleImage.rejected, (state, action) => {
                const payload = action.payload as { index: number; error: string };
                if (state.files[payload.index]) {
                    state.files[payload.index].status = 'error';
                    state.files[payload.index].error = payload.error;
                    state.files[payload.index].progress = 0;
                }
            });
    },
});

export const { addFiles, removeFile, clearAllFiles, updateFileProgress, updateFileHealth } = uploadSlice.actions;
export default uploadSlice.reducer;
