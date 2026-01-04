import axios from 'axios';
import type { PlantData, GeoLocation } from '../types';

const API_BASE_URL = 'https://api.alumnx.com/api/hackathons';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'demo_preset';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Demo mode flag - set to true to use mock data without Cloudinary
const DEMO_MODE = !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME === 'demo';

// Mock GPS mode - use mock GPS data to bypass CORS issues
const USE_MOCK_GPS = import.meta.env.VITE_USE_MOCK_GPS === 'true';

// Debug: Log configuration on load
console.log('🔧 FarmGeo API Configuration:', {
    demoMode: DEMO_MODE,
    useMockGPS: USE_MOCK_GPS,
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    apiBaseUrl: API_BASE_URL,
    cloudinaryUrl: CLOUDINARY_UPLOAD_URL
});

/**
 * Upload image to Cloudinary (or use demo mode)
 */
export const uploadToCloudinary = async (file: File): Promise<{ url: string; originalname: string }> => {
    // DEMO MODE: Use local object URL instead of Cloudinary
    if (DEMO_MODE) {
        console.log('📸 DEMO MODE: Using local image preview instead of Cloudinary');

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create a local object URL for the image
        const localUrl = URL.createObjectURL(file);

        return {
            url: localUrl,
            originalname: file.name,
        };
    }

    // PRODUCTION MODE: Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        console.log('📤 Uploading to Cloudinary:', {
            cloudName: CLOUDINARY_CLOUD_NAME,
            preset: CLOUDINARY_UPLOAD_PRESET,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        });

        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 second timeout
        });

        console.log('✅ Cloudinary upload successful:', response.data);

        return {
            url: response.data.secure_url,
            originalname: response.data.original_filename || file.name,
        };
    } catch (error: any) {
        console.error('❌ Cloudinary upload error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: {
                url: error.config?.url,
                method: error.config?.method
            }
        });

        if (error.code === 'ECONNABORTED') {
            throw new Error('Upload timeout. Please check your internet connection and try again.');
        }

        if (error.response?.status === 400) {
            throw new Error(`Cloudinary error: ${error.response?.data?.error?.message || 'Invalid upload preset or configuration'}`);
        }

        throw new Error(error.response?.data?.error?.message || error.message || 'Failed to upload image to Cloudinary');
    }
};

/**
 * Extract GPS coordinates from image EXIF data
 */
export const extractGPSFromImage = async (file: File): Promise<GeoLocation | null> => {
    try {
        console.log('📸 Reading EXIF data from image...');

        // Dynamically import exifr
        const exifr = await import('exifr');

        // Parse GPS data from image
        const gpsData = await exifr.gps(file);

        if (gpsData && gpsData.latitude && gpsData.longitude) {
            console.log('✅ GPS data found in image EXIF:', gpsData);
            return {
                latitude: Number(gpsData.latitude.toFixed(6)),
                longitude: Number(gpsData.longitude.toFixed(6)),
            };
        }

        console.log('⚠️ No GPS data found in image EXIF');
        return null;
    } catch (error: any) {
        console.error('❌ Error reading EXIF data:', error.message);
        return null;
    }
};

/**
 * Extract geolocation from image using backend API ONLY
 */
export const extractGeolocation = async (
    imageUrl: string,
    imageName: string,
    emailId: string
): Promise<GeoLocation> => {
    console.log('🌐 Extracting GPS using backend API...');

    try {
        const requestPayload = {
            emailId,
            imageName,
            imageUrl,
        };

        console.log('📤 Sending request to backend API:', requestPayload);

        const response = await fetch('https://api.alumnx.com/api/hackathons/extract-latitude-longitude', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📥 Backend API response:', result);

        if (result.success && result.data) {
            const coords = {
                latitude: result.data.latitude,
                longitude: result.data.longitude,
            };
            console.log('✅ GPS coordinates extracted from backend API');
            return coords;
        }

        throw new Error('Backend API did not return valid GPS data');
    } catch (error: any) {
        console.error('❌ Backend API GPS extraction failed:', error.message);
        throw new Error(`Failed to extract GPS coordinates: ${error.message}`);
    }
};


/**
 * Save plant data to backend
 */
export const savePlantData = async (plantData: PlantData): Promise<any> => {
    console.log('💾 Saving plant data to backend...');

    try {
        // Prepare request payload matching backend API format
        const requestPayload = {
            emailId: plantData.emailId,
            imageName: plantData.imageName,
            imageUrl: plantData.imageUrl,
            latitude: plantData.latitude,
            longitude: plantData.longitude,
        };

        console.log('📤 Sending plant data to backend:', requestPayload);

        const response = await fetch('https://api.alumnx.com/api/hackathons/save-plant-location-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Plant data saved successfully:', result);

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to save plant data');
        }
    } catch (error: any) {
        console.error('❌ Failed to save plant data:', error.message);
        // Don't throw - allow local storage to work as fallback
        console.warn('⚠️ API save failed, data will be saved locally only');
        return null;
    }
};


/**
 * Check if app is in demo mode
 */
export const isDemoMode = (): boolean => DEMO_MODE;
