import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addFiles, removeFile, clearAllFiles, uploadBatchImages, updateFileHealth } from '../store/uploadSlice';
import { saveNewPlant } from '../store/plantsSlice';
import { setCurrentUserEmail } from '../store/settingsSlice';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Check, Loader2, MapPin, AlertCircle, Info, Trash2, Save, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { isDemoMode } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

export const UploadComponent = () => {
    const { t } = useTranslation();
    const demoMode = isDemoMode();
    const useMockGPS = import.meta.env.VITE_USE_MOCK_GPS === 'true';
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { files, overallStatus, error } = useAppSelector((state) => state.upload);
    const { currentUserEmail } = useAppSelector((state) => state.settings);
    const [email, setEmail] = useState(currentUserEmail || '');

    useEffect(() => {
        if (currentUserEmail) {
            setEmail(currentUserEmail);
        }
    }, [currentUserEmail]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles?.length > 0) {
                dispatch(addFiles(acceptedFiles));
            }
        },
        [dispatch]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        maxFiles: 10,
        disabled: overallStatus === 'uploading',
    });

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error(t('pleaseSelectImages'));
            return;
        }
        if (!email) {
            toast.error(t('pleaseEnterEmail'));
            return;
        }

        dispatch(setCurrentUserEmail(email));
        dispatch(uploadBatchImages({ email }));
    };

    const handleSaveAll = async () => {
        const successfulUploads = files.filter(
            (f) => f.status === 'success' && f.uploadedImageUrl && f.extractedLocation
        );

        if (successfulUploads.length === 0) {
            toast.error('No successfully uploaded images to save.');
            return;
        }

        if (!email) {
            toast.error(t('pleaseEnterEmail'));
            return;
        }

        try {
            dispatch(setCurrentUserEmail(email));

            for (const fileItem of successfulUploads) {
                const plantData = {
                    emailId: email,
                    imageName: fileItem.file.name,
                    imageUrl: fileItem.uploadedImageUrl!,
                    latitude: fileItem.extractedLocation!.latitude,
                    longitude: fileItem.extractedLocation!.longitude,
                    uploadTimestamp: new Date().toISOString(),
                    health: fileItem.health, // Include health status
                };
                await dispatch(saveNewPlant(plantData)).unwrap();
            }

            toast.success(`${successfulUploads.length} ${t('plantsSavedSuccess')}`);
            dispatch(clearAllFiles());
            setEmail(email);
            navigate('/');
        } catch (err) {
            toast.error(t('failedToSave'));
        }
    };

    const handleRemoveFile = (index: number) => {
        dispatch(removeFile(index));
    };

    const handleClearAll = () => {
        dispatch(clearAllFiles());
    };

    const successCount = files.filter((f) => f.status === 'success').length;
    const errorCount = files.filter((f) => f.status === 'error').length;
    const uploadingCount = files.filter((f) => f.status === 'uploading').length;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                    <UploadCloud size={28} />
                    {t('batchUploadPlants')}
                </h2>
                {files.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        disabled={overallStatus === 'uploading'}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 disabled:opacity-50 font-semibold transition-colors duration-200"
                    >
                        <Trash2 size={16} />
                        {t('clearAll')}
                    </button>
                )}
            </div>

            {/* Demo/Mock GPS Mode Info */}
            {(demoMode || useMockGPS) && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            {demoMode ? (
                                <>
                                    <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">{t('demoModeActive')}</p>
                                    <p className="text-amber-800 dark:text-amber-300">
                                        {t('demoModeDesc')}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">{t('hybridModeActive')}</p>
                                    <p className="text-amber-800 dark:text-amber-300">
                                        {t('hybridModeDesc')}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Email Input */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <User size={18} className="text-green-600 dark:text-green-400" />
                    {t('yourEmail')} <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-green-500 dark:focus:border-green-600 outline-none transition-all duration-200"
                    disabled={overallStatus === 'uploading'}
                    required
                />
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${isDragActive
                    ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 bg-gray-50 dark:bg-gray-700/30'
                    } ${overallStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-3" />
                <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg mb-1">
                    {isDragActive ? t('dragDropImages') : t('dragDropImages')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('orClickToSelect')}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('supportsJpgPng')}</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                            {t('selectedImages')} ({files.length})
                        </h3>
                        {overallStatus === 'success' && (
                            <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                ✓ {successCount} {t('uploadSuccessful')} {errorCount > 0 && `• ${errorCount} failed`}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {files.map((fileItem, index) => (
                            <div
                                key={index}
                                className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3 border border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 shadow-sm"
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={fileItem.previewUrl}
                                        alt={fileItem.file.name}
                                        className="w-20 h-20 object-cover rounded-md flex-shrink-0 border border-green-300 dark:border-green-600"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate" title={fileItem.file.name}>
                                            {fileItem.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(fileItem.file.size / 1024).toFixed(1)} KB
                                        </p>

                                        {/* Health Status Selector */}
                                        <div className="mt-2">
                                            <select
                                                value={fileItem.health}
                                                onChange={(e) => dispatch(updateFileHealth({
                                                    index,
                                                    health: e.target.value as 'healthy' | 'warning' | 'critical'
                                                }))}
                                                disabled={fileItem.status === 'uploading'}
                                                className={`text-xs font-semibold px-2 py-1 rounded border-2 outline-none transition-all ${fileItem.health === 'healthy'
                                                        ? 'bg-green-50 border-green-300 text-green-700'
                                                        : fileItem.health === 'warning'
                                                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                                                            : 'bg-red-50 border-red-300 text-red-700'
                                                    } disabled:opacity-50`}
                                            >
                                                <option value="healthy">🟢 Healthy</option>
                                                <option value="warning">🟡 Warning</option>
                                                <option value="critical">🔴 Critical</option>
                                            </select>
                                        </div>

                                        {/* Status */}
                                        <div className="mt-2">
                                            {fileItem.status === 'idle' && (
                                                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{t('readyToUpload')}</span>
                                            )}
                                            {fileItem.status === 'uploading' && (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                                        <Loader2 className="animate-spin" size={12} />
                                                        {t('processing')}
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                                        <div
                                                            className="bg-gradient-to-r from-green-600 to-green-500 h-1.5 rounded-full transition-all duration-300"
                                                            style={{ width: `${fileItem.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                            {fileItem.status === 'success' && fileItem.extractedLocation && (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold">
                                                        <Check size={12} />
                                                        {t('uploadSuccessful')}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 mt-1">
                                                        <MapPin size={10} />
                                                        {fileItem.extractedLocation.latitude.toFixed(4)}, {fileItem.extractedLocation.longitude.toFixed(4)}
                                                    </div>
                                                </div>
                                            )}
                                            {fileItem.status === 'error' && (
                                                <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-semibold">
                                                    <AlertCircle size={12} />
                                                    {fileItem.error || 'Upload failed'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    {fileItem.status !== 'uploading' && (
                                        <button
                                            onClick={() => handleRemoveFile(index)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 transition-colors duration-200 flex-shrink-0"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-lg flex items-start border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold">Error: </span>
                        {error}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                {overallStatus !== 'success' && files.length > 0 && (
                    <button
                        onClick={handleUpload}
                        disabled={!email || overallStatus === 'uploading'}
                        className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-lg font-semibold text-base hover:from-green-700 hover:to-green-800 dark:hover:from-green-800 dark:hover:to-green-900 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {overallStatus === 'uploading' ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {t('processing')} {uploadingCount} of {files.length}...
                            </>
                        ) : (
                            <>
                                <UploadCloud size={20} />
                                {t('uploadAll')} ({files.length})
                            </>
                        )}
                    </button>
                )}

                {overallStatus === 'success' && successCount > 0 && (
                    <button
                        onClick={handleSaveAll}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-lg font-semibold text-base hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                        <Save size={20} />
                        {t('saveAllToMap')} ({successCount})
                    </button>
                )}
            </div>
        </div>
    );
};
