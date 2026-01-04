import { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { deletePlant, setFilter } from '../store/plantsSlice';
import { Trash2, Calendar, MapPin, User, ExternalLink, Search, Filter, X, Grid3x3, Map as MapIcon } from 'lucide-react';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to handle map bounds/flyTo
const MapController = ({ plants }: { plants: any[] }) => {
    const map = useMap();

    useEffect(() => {
        if (plants.length > 0) {
            const bounds = plants.map((p) => [p.latitude, p.longitude] as [number, number]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [plants, map]);

    return null;
};

export const MapComponent = () => {
    const dispatch = useAppDispatch();
    const { plants, filter } = useAppSelector((state) => state.plants);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
    const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

    // Filter and search plants
    const filteredPlants = useMemo(() => {
        let result = plants.filter((p) => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude));

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.imageName.toLowerCase().includes(query) ||
                    p.emailId.toLowerCase().includes(query) ||
                    p.latitude.toString().includes(query) ||
                    p.longitude.toString().includes(query)
            );
        }

        // Apply filter
        if (filter === 'recent') {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            result = result.filter((p) => new Date(p.uploadTimestamp) > oneDayAgo);
        } else if (filter === 'healthy') {
            result = result.filter((p) => p.health === 'healthy' || !p.health);
        } else if (filter === 'warning') {
            result = result.filter((p) => p.health === 'warning');
        } else if (filter === 'critical') {
            result = result.filter((p) => p.health === 'critical');
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.uploadTimestamp).getTime() - new Date(a.uploadTimestamp).getTime();
            } else {
                return a.imageName.localeCompare(b.imageName);
            }
        });

        return result;
    }, [plants, searchQuery, filter, sortBy]);

    const defaultCenter: [number, number] = [20.5937, 78.9629]; // India center

    const handleDelete = (imageUrl: string, imageName: string) => {
        if (window.confirm(`Are you sure you want to delete "${imageName}"?`)) {
            dispatch(deletePlant(imageUrl));
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-nature-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-nature-800 mb-2">Farm Map</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <MapPin size={16} className="text-nature-600" />
                                <strong>{filteredPlants.length}</strong> {filteredPlants.length === 1 ? 'plant' : 'plants'}
                            </span>
                            {searchQuery && (
                                <span className="text-blue-600">
                                    Filtered from {plants.length} total
                                </span>
                            )}
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-2 ${viewMode === 'map'
                                ? 'bg-white text-nature-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <MapIcon size={16} />
                            Map View
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-2 ${viewMode === 'grid'
                                ? 'bg-white text-nature-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <Grid3x3 size={16} />
                            Grid View
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg border border-nature-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or coordinates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={filter}
                            onChange={(e) => dispatch(setFilter(e.target.value as any))}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all appearance-none"
                        >
                            <option value="all">All Plants</option>
                            <option value="recent">📅 Recent (24h)</option>
                            <option value="healthy">🟢 Healthy Plants</option>
                            <option value="warning">🟡 Warning Status</option>
                            <option value="critical">🔴 Critical Status</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full px-4 py-2 border-2 border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all appearance-none"
                        >
                            <option value="date">Sort by Date (Newest)</option>
                            <option value="name">Sort by Name (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Map or Grid View */}
            {filteredPlants.length === 0 ? (
                <div className="h-[600px] w-full flex items-center justify-center bg-gradient-to-br from-nature-50 to-earth-50 border-2 border-dashed border-nature-300 rounded-xl">
                    <div className="text-center p-8 max-w-md">
                        <MapPin className="mx-auto h-20 w-20 text-nature-300 mb-4" />
                        <h3 className="text-2xl font-bold text-nature-700 mb-2">
                            {searchQuery ? 'No Results Found' : 'No Plants Yet'}
                        </h3>
                        <p className="text-nature-600 mb-4">
                            {searchQuery
                                ? 'Try adjusting your search or filters'
                                : 'Upload your first geo-tagged plant image to see it on the map!'}
                        </p>
                        {!searchQuery && (
                            <a
                                href="/upload"
                                className="inline-block px-6 py-3 bg-nature-600 text-white rounded-lg font-semibold hover:bg-nature-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Upload Plant
                            </a>
                        )}
                    </div>
                </div>
            ) : viewMode === 'map' ? (
                <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border-2 border-nature-200 z-0 relative">
                    <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom={true} className="h-full w-full">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapController plants={filteredPlants} />

                        {filteredPlants.map((plant, index) => {
                            // User Differentiation: Assign specific icon based on email
                            const AVATARS = ['👨‍🌾', '👩‍🌾', '🧑‍🌾', '🤠', '👷', '👮', '🕵️', '🧙', '🧚', '🧛', '🧞', '🧜'];
                            const getUserAvatar = (email: string) => {
                                let hash = 0;
                                for (let i = 0; i < email.length; i++) {
                                    hash = email.charCodeAt(i) + ((hash << 5) - hash);
                                }
                                return AVATARS[Math.abs(hash) % AVATARS.length];
                            };

                            const userAvatar = getUserAvatar(plant.emailId);

                            // Keep health status as color indication
                            const healthStatus = plant.health || 'healthy';
                            const borderColor = healthStatus === 'healthy' ? '#10b981' :
                                healthStatus === 'warning' ? '#f59e0b' : '#ef4444';

                            const customIcon = L.divIcon({
                                html: `
                                    <div class="plant-marker plant-marker-${healthStatus}" style="
                                        width: 50px;
                                        height: 50px;
                                        background: white;
                                        border: 4px solid ${borderColor};
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 28px;
                                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                        cursor: pointer;
                                        position: relative;
                                    ">
                                        ${userAvatar}
                                        <div style="
                                            position: absolute;
                                            bottom: -5px;
                                            right: -5px;
                                            width: 20px;
                                            height: 20px;
                                            background: ${borderColor};
                                            border: 2px solid white;
                                            border-radius: 50%;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            color: white;
                                            font-size: 10px;
                                            font-weight: bold;
                                        ">
                                            ${healthStatus === 'healthy' ? '✓' : '!'}
                                        </div>
                                    </div>
                                `,
                                className: '', // Important: Empty class to avoid default leaflet styles
                                iconSize: [50, 50],
                                iconAnchor: [25, 50],
                                popupAnchor: [0, -50]
                            });

                            return (
                                <Marker
                                    key={`${plant.imageUrl}-${index}`}
                                    position={[plant.latitude, plant.longitude]}
                                    icon={customIcon}
                                >
                                    <Popup className="custom-popup" maxWidth={300}>
                                        <div className="min-w-[250px]">
                                            <div className="relative mb-3 rounded-lg overflow-hidden h-40 w-full bg-gray-100">
                                                <img
                                                    src={plant.imageUrl}
                                                    alt={plant.imageName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                    }}
                                                />
                                                <div className="absolute top-2 right-2 bg-nature-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                                                    #{index + 1}
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-nature-800 text-lg mb-2 truncate" title={plant.imageName}>
                                                {plant.imageName}
                                            </h3>



                                            {/* Health Status */}
                                            {plant.health && (
                                                <div className={`mb-3 p-3 rounded-lg border ${plant.health === 'healthy'
                                                    ? 'bg-green-50 border-green-200'
                                                    : plant.health === 'warning'
                                                        ? 'bg-orange-50 border-orange-200'
                                                        : 'bg-red-50 border-red-200'
                                                    }`}>
                                                    <div className={`font-bold text-sm mb-1 ${plant.health === 'healthy'
                                                        ? 'text-green-900'
                                                        : plant.health === 'warning'
                                                            ? 'text-orange-900'
                                                            : 'text-red-900'
                                                        }`}>
                                                        {plant.health === 'healthy' && '🟢 Healthy Plant'}
                                                        {plant.health === 'warning' && '🟡 Needs Attention'}
                                                        {plant.health === 'critical' && '🔴 Critical Condition'}
                                                    </div>
                                                    {plant.notes && (
                                                        <div className={`text-xs ${plant.health === 'healthy'
                                                            ? 'text-green-700'
                                                            : plant.health === 'warning'
                                                                ? 'text-orange-700'
                                                                : 'text-red-700'
                                                            }`}>
                                                            {plant.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-nature-600 flex-shrink-0" />
                                                    <span className="truncate">{plant.emailId}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-nature-600 flex-shrink-0" />
                                                    <span>
                                                        {plant.uploadTimestamp
                                                            ? format(new Date(plant.uploadTimestamp), 'MMM d, yyyy HH:mm')
                                                            : 'Unknown Date'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-nature-600 flex-shrink-0" />
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${plant.latitude},${plant.longitude}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {plant.latitude.toFixed(4)}, {plant.longitude.toFixed(4)}
                                                        <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(plant.imageUrl, plant.imageName)}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                                            >
                                                <Trash2 size={14} />
                                                Delete Entry
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlants.map((plant, index) => (
                        <div
                            key={`${plant.imageUrl}-${index}`}
                            className="bg-white rounded-xl shadow-lg border-2 border-nature-100 overflow-hidden hover:shadow-xl transition-all hover:scale-105"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={plant.imageUrl}
                                    alt={plant.imageName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-nature-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                                    #{index + 1}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-nature-800 dark:text-white text-lg mb-3 truncate" title={plant.imageName}>
                                    {plant.imageName}
                                </h3>



                                {/* Plant Health */}
                                {plant.health && (
                                    <div className={`mb-3 p-3 rounded-lg border ${plant.health === 'healthy'
                                        ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
                                        : plant.health === 'warning'
                                            ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700'
                                            : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                                        }`}>
                                        <div className={`font-bold text-sm mb-1 ${plant.health === 'healthy'
                                            ? 'text-green-900 dark:text-green-300'
                                            : plant.health === 'warning'
                                                ? 'text-orange-900 dark:text-orange-300'
                                                : 'text-red-900 dark:text-red-300'
                                            }`}>
                                            {plant.health === 'healthy' && '🟢 Healthy'}
                                            {plant.health === 'warning' && '🟡 Warning'}
                                            {plant.health === 'critical' && '🔴 Critical'}
                                        </div>
                                        {plant.notes && (
                                            <div className={`text-xs ${plant.health === 'healthy'
                                                ? 'text-green-700 dark:text-green-400'
                                                : plant.health === 'warning'
                                                    ? 'text-orange-700 dark:text-orange-400'
                                                    : 'text-red-700 dark:text-red-400'
                                                }`}>
                                                {plant.notes}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-nature-600 flex-shrink-0" />
                                        <span className="truncate">{plant.emailId}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-nature-600 flex-shrink-0" />
                                        <span>
                                            {plant.uploadTimestamp
                                                ? format(new Date(plant.uploadTimestamp), 'MMM d, yyyy HH:mm')
                                                : 'Unknown Date'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-nature-600 flex-shrink-0" />
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${plant.latitude},${plant.longitude}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                                        >
                                            {plant.latitude.toFixed(4)}, {plant.longitude.toFixed(4)}
                                            <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(plant.imageUrl, plant.imageName)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                                >
                                    <Trash2 size={14} />
                                    Delete Entry
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};
