export interface PlantData {
  id?: string;
  emailId: string;
  imageName: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  uploadTimestamp: string;
  health?: 'healthy' | 'warning' | 'critical';
  notes?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileUploadItem {
  file: File;
  previewUrl: string;
  status: UploadStatus;
  progress: number;
  error: string | null;
  uploadedImageUrl: string | null;
  extractedLocation: GeoLocation | null;
  health: 'healthy' | 'warning' | 'critical'; // Manual health status selection
}

export interface UploadState {
  files: FileUploadItem[];
  overallStatus: UploadStatus;
  error: string | null;
}

export interface PlantState {
  plants: PlantData[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'recent' | 'healthy' | 'warning' | 'critical';
  userFilter: 'all' | 'mine'; // Filter by user email
}

export interface AppSettings {
  theme: 'light' | 'dark';
  mapStyle: 'standard' | 'satellite';
  notifications: boolean;
  language: 'en' | 'hi' | 'mr';
  currentUserEmail: string;
}

export interface FarmBoundary {
  id: string;
  name: string;
  coordinates: GeoLocation[];
  color: string;
}

export interface Analytics {
  totalPlants: number;
  healthyPlants: number;
  warningPlants: number;
  criticalPlants: number;
  plantsThisWeek: number;
  plantsThisMonth: number;
  mostActiveFarmer: string;
}
