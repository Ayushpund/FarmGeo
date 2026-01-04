# FarmGeoTag

FarmGeoTag is a web-based platform designed to help farmers and agricultural communities collaboratively map, monitor, and manage plant health data. By combining geolocation with visual health indicators, it allows users to build a shared digital map of their farms.

## Features

- **Interactive Farm Map**: Visualize plant locations on a dynamic map. Each plant is represented by a user-specific avatar, making it easy to identify contributors in a shared environment.
- **Health Monitoring**: Quickly assess plant status through visual cues. Markers are color-coded (Green for Healthy, Amber for Warning, Red for Critical) and include status badges for immediate recognition.
- **Collaborative Uploads**: Users can upload geo-tagged plant images. The system automatically extracts GPS coordinates and allows users to manually categorize plant health during the upload process.
- **Analytics Dashboard**: Insights at a glance. View real-time statistics on plant health distribution, track contributions, and identify top contributors within the community.
- **Multilingual Support**: Fully localized interface available in English, Hindi, and Marathi to support diverse user bases.

## Technology Stack

- **Frontend**: React (TypeScript)
- **State Management**: Redux Toolkit
- **Mapping**: Leaflet / React-Leaflet
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## Usage Guide

1.  **Upload**: Navigate to the upload page, drop your plant images, and select the health status for each plant.
2.  **Map**: View the main dashboard to see your uploads on the map. Click on any marker to see details like the image, upload date, and contributor.
3.  **Analyze**: Visit the analytics section to see a breakdown of healthy vs. critical plants and export data if needed.
