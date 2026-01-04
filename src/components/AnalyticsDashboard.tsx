import { useMemo, useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { useTranslation } from '../hooks/useTranslation';
import { TrendingUp, Activity, AlertTriangle, CheckCircle, Calendar, Users, Download, PieChart as PieChartIcon, User } from 'lucide-react';
import { format as formatDate, subDays, subMonths } from 'date-fns';

// Simple Pie Chart Component
const HealthPieChart = ({ data, size = 200 }: { data: { label: string; value: number; color: string }[]; size?: number }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return (
            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
                <p className="text-gray-400 dark:text-gray-500 text-sm">No data</p>
            </div>
        );
    }

    let currentAngle = -90; // Start from top
    const radius = size / 2;
    const center = radius;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {data.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;

                    const startX = center + radius * 0.9 * Math.cos((startAngle * Math.PI) / 180);
                    const startY = center + radius * 0.9 * Math.sin((startAngle * Math.PI) / 180);
                    const endX = center + radius * 0.9 * Math.cos((endAngle * Math.PI) / 180);
                    const endY = center + radius * 0.9 * Math.sin((endAngle * Math.PI) / 180);

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = [
                        `M ${center} ${center}`,
                        `L ${startX} ${startY}`,
                        `A ${radius * 0.9} ${radius * 0.9} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        'Z',
                    ].join(' ');

                    currentAngle = endAngle;

                    return (
                        <path
                            key={index}
                            d={pathData}
                            fill={item.color}
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-300 hover:opacity-80"
                        />
                    );
                })}
                {/* Center circle for donut effect */}
                <circle cx={center} cy={center} r={radius * 0.5} fill="white" className="dark:fill-gray-800" />
                <text
                    x={center}
                    y={center}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold fill-gray-800 dark:fill-white"
                >
                    {total}
                </text>
            </svg>
        </div>
    );
};

export const AnalyticsDashboard = () => {
    const { t } = useTranslation();
    const { plants } = useAppSelector((state) => state.plants);
    // User filter state
    const [selectedUser, setSelectedUser] = useState<string>('all');

    // Get unique farmers
    const uniqueFarmers = useMemo(() => {
        const emails = new Set(plants.map(p => p.emailId));
        return Array.from(emails);
    }, [plants]);

    // Filter plants by selected user
    const filteredPlants = useMemo(() => {
        if (selectedUser === 'all') return plants;
        return plants.filter(p => p.emailId === selectedUser);
    }, [plants, selectedUser]);

    const analytics = useMemo(() => {
        const now = new Date();
        const weekAgo = subDays(now, 7);
        const monthAgo = subMonths(now, 1);

        const healthyPlants = filteredPlants.filter((p) => p.health === 'healthy' || !p.health).length;
        const warningPlants = filteredPlants.filter((p) => p.health === 'warning').length;
        const criticalPlants = filteredPlants.filter((p) => p.health === 'critical').length;

        const plantsThisWeek = filteredPlants.filter(
            (p) => new Date(p.uploadTimestamp) > weekAgo
        ).length;

        const plantsThisMonth = filteredPlants.filter(
            (p) => new Date(p.uploadTimestamp) > monthAgo
        ).length;

        // Find most active farmer (from all plants, not filtered)
        const farmerCounts = plants.reduce((acc, plant) => {
            acc[plant.emailId] = (acc[plant.emailId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topFarmers = Object.entries(farmerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2); // Get top 2

        return {
            totalPlants: filteredPlants.length,
            healthyPlants,
            warningPlants,
            criticalPlants,
            plantsThisWeek,
            plantsThisMonth,
            topFarmers, // Array of top 2 farmers
            healthPercentage: filteredPlants.length > 0 ? Math.round((healthyPlants / filteredPlants.length) * 100) : 0,
        };
    }, [filteredPlants, plants]);

    const exportData = (exportFormat: 'csv' | 'json') => {
        const dataToExport = selectedUser === 'all' ? plants : filteredPlants;

        if (exportFormat === 'json') {
            const dataStr = JSON.stringify(dataToExport, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `farm-data-${selectedUser}-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } else {
            const headers = ['Email', 'Image Name', 'Latitude', 'Longitude', 'Upload Date', 'Health Status'];
            const csvRows = [
                headers.join(','),
                ...dataToExport.map((p) =>
                    [
                        p.emailId,
                        `"${p.imageName}"`,
                        p.latitude,
                        p.longitude,
                        formatDate(new Date(p.uploadTimestamp), 'yyyy-MM-dd HH:mm:ss'),
                        p.health || 'healthy',
                    ].join(',')
                ),
            ];
            const csvStr = csvRows.join('\n');
            const dataBlob = new Blob([csvStr], { type: 'text/csv' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `farm-data-${selectedUser}-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, subtitle }: any) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800 dark:text-white">{value}</div>
                    {subtitle && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>}
                </div>
            </div>
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</div>
        </div>
    );

    // Pie chart data
    const healthPieData = [
        { label: t('healthy'), value: analytics.healthyPlants, color: '#10b981' },
        { label: t('warning'), value: analytics.warningPlants, color: '#f59e0b' },
        { label: t('critical'), value: analytics.criticalPlants, color: '#ef4444' },
    ];

    return (
        <div className="space-y-6">
            {/* Header with User Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('farmAnalytics')}</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('analyticsDescription')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* User Filter Dropdown */}
                        {uniqueFarmers.length > 1 && (
                            <div className="relative">
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-green-500 outline-none appearance-none pr-10"
                                >
                                    <option value="all">{t('allFarmers')} ({plants.length})</option>
                                    {uniqueFarmers.map((email) => {
                                        const count = plants.filter(p => p.emailId === email).length;
                                        return (
                                            <option key={email} value={email}>
                                                {email} ({count})
                                            </option>
                                        );
                                    })}
                                </select>
                                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-400 pointer-events-none" size={16} />
                            </div>
                        )}
                        <button
                            onClick={() => exportData('csv')}
                            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => exportData('json')}
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <Download size={18} />
                            Export JSON
                        </button>
                    </div>
                </div>
                {selectedUser !== 'all' && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                            Viewing stats for: <strong>{selectedUser}</strong>
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Activity}
                    label={t('totalPlants')}
                    value={analytics.totalPlants}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    icon={CheckCircle}
                    label={t('healthyPlants')}
                    value={analytics.healthyPlants}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                    subtitle={`${analytics.healthPercentage}% of total`}
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Need Attention"
                    value={analytics.warningPlants + analytics.criticalPlants}
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                    subtitle={`${analytics.warningPlants} warning, ${analytics.criticalPlants} critical`}
                />
                <StatCard
                    icon={TrendingUp}
                    label="This Week"
                    value={analytics.plantsThisWeek}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                    subtitle={`${analytics.plantsThisMonth} this month`}
                />
            </div>

            {/* Pie Charts and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Health Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChartIcon size={24} className="text-green-600 dark:text-green-400" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Plant Health Distribution</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <HealthPieChart data={healthPieData} size={220} />
                        <div className="mt-6 w-full space-y-2">
                            {healthPieData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                                        {item.value} ({analytics.totalPlants > 0 ? Math.round((item.value / analytics.totalPlants) * 100) : 0}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="text-green-600 dark:text-green-400" size={24} />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last 7 days</span>
                            <span className="text-2xl font-bold text-green-700 dark:text-green-400">{analytics.plantsThisWeek}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last 30 days</span>
                            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{analytics.plantsThisMonth}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">All time</span>
                            <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">{analytics.totalPlants}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Contributors (only show when viewing all) */}
            {selectedUser === 'all' && uniqueFarmers.length > 0 && analytics.topFarmers.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="text-green-600 dark:text-green-400" size={24} />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('topContributor')}</h3>
                    </div>
                    <div className="space-y-4">
                        {analytics.topFarmers.map(([email, count], index) => (
                            <div key={email} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className={`w-14 h-14 ${index === 0 ? 'bg-green-600 dark:bg-green-700' : 'bg-green-500 dark:bg-green-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                    <span className="text-white font-bold text-xl">#{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-lg text-gray-800 dark:text-white truncate" title={email}>
                                        {email}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {count} {t('plantsUploaded')}
                                    </div>
                                </div>
                                {index === 0 && (
                                    <div className="text-3xl">🏆</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
