import { Sprout, Info, BarChart3, Languages, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { isDemoMode } from '../services/api';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setLanguage } from '../store/settingsSlice';
import { useTranslation } from '../hooks/useTranslation';

export const Header = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const isActive = (path: string) => location.pathname === path;
    const demoMode = isDemoMode();
    const { language } = useAppSelector((state) => state.settings);
    const [showLangMenu, setShowLangMenu] = useState(false);

    const changeLanguage = (lang: 'en' | 'hi' | 'mr') => {
        dispatch(setLanguage(lang));
        setShowLangMenu(false);
    };

    const languageNames = {
        en: 'English',
        hi: 'हिंदी',
        mr: 'मराठी',
    };

    return (
        <header className="bg-white dark:bg-gray-900 border-b-2 border-green-600 dark:border-green-500 sticky top-0 z-50 shadow-md transition-all duration-300">
            {/* Demo Mode Banner */}
            {demoMode && (
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700 text-white px-4 py-2 text-center text-sm font-semibold">
                    <div className="flex items-center justify-center gap-2">
                        <Info size={16} />
                        <span>
                            Demo Mode - Using mock data. Configure Cloudinary in .env to enable real uploads.
                        </span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Professional Farm Theme */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 p-2.5 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
                                <Sprout size={28} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-600 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
                                {t('appName')}
                            </span>
                            {demoMode && (
                                <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-300 dark:border-amber-700">
                                    DEMO
                                </span>
                            )}
                        </div>
                    </Link>

                    {/* Navigation & Controls */}
                    <div className="flex items-center gap-2">
                        <nav className="hidden md:flex space-x-1">
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isActive('/')
                                    ? 'bg-green-600 dark:bg-green-700 text-white shadow-md'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                                    }`}
                            >
                                <MapPin size={16} />
                                {t('home')}
                            </Link>
                            <Link
                                to="/upload"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive('/upload')
                                    ? 'bg-green-600 dark:bg-green-700 text-white shadow-md'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                                    }`}
                            >
                                {t('upload')}
                            </Link>
                            <Link
                                to="/analytics"
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isActive('/analytics')
                                    ? 'bg-green-600 dark:bg-green-700 text-white shadow-md'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                                    }`}
                            >
                                <BarChart3 size={16} />
                                {t('analytics')}
                            </Link>
                        </nav>

                        {/* Language Selector - Professional */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                aria-label={t('language')}
                            >
                                <Languages size={20} />
                            </button>
                            {showLangMenu && (
                                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                                    {(['en', 'hi', 'mr'] as const).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => changeLanguage(lang)}
                                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${language === lang
                                                ? 'bg-green-600 dark:bg-green-700 text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {language === lang && '✓ '}
                                            {languageNames[lang]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation - Professional */}
            <div className="md:hidden bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <nav className="flex justify-around py-2 px-4">
                    <Link
                        to="/"
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${isActive('/')
                            ? 'bg-green-600 dark:bg-green-700 text-white'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {t('home')}
                    </Link>
                    <Link
                        to="/upload"
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${isActive('/upload')
                            ? 'bg-green-600 dark:bg-green-700 text-white'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {t('upload')}
                    </Link>
                    <Link
                        to="/analytics"
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${isActive('/analytics')
                            ? 'bg-green-600 dark:bg-green-700 text-white'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {t('analytics')}
                    </Link>
                </nav>
            </div>
        </header>
    );
};
