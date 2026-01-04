// Internationalization translations
export const translations = {
    en: {
        // Header
        appName: 'FarmGeoTag',
        home: 'Home',
        upload: 'Upload',
        analytics: 'Analytics',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        language: 'Language',

        // Dashboard
        myFarmOverview: 'My Farm Overview',
        farmDescription: 'Visualize all your tagged plants in one place. Click on markers for details or upload new geo-tagged images to expand your farm map.',
        quickStats: 'Quick Stats',
        totalPlants: 'Total Plants',
        myPlants: 'My Plants',
        allFarmers: 'All Farmers',
        lastUpdate: 'Last Update',
        coverage: 'Coverage',
        status: 'Status',
        recently: 'Recently',
        noData: 'No data',
        good: 'Good',
        growing: 'Growing',
        active: 'Active',

        // Upload Page
        addNewPlant: 'Add New Plant',
        uploadDescription: 'Upload a geo-tagged image to automatically extract GPS coordinates and add it to your farm map.',
        batchUploadPlants: 'Batch Upload Plant Images',
        yourEmail: 'Your Email (User ID)',
        dragDropImages: 'Drag & drop images here',
        orClickToSelect: 'or click to select (up to 10 images)',
        supportsJpgPng: 'Supports JPG, PNG with GPS data',
        selectedImages: 'Selected Images',
        readyToUpload: 'Ready to upload',
        processing: 'Processing...',
        uploadSuccessful: 'Upload successful',
        uploadAll: 'Upload All',
        saveAllToMap: 'Save All to Map',
        clearAll: 'Clear All',
        deleteEntry: 'Delete Entry',

        // Map Component
        farmMap: 'Farm Map',
        plants: 'plants',
        plant: 'plant',
        filteredFrom: 'Filtered from',
        total: 'total',
        mapView: 'Map View',
        gridView: 'Grid View',
        searchPlaceholder: 'Search by name, email, or coordinates...',
        allPlants: 'All Plants',
        recent24h: 'Recent (24h)',
        healthyPlants: 'Healthy Plants',
        warningStatus: 'Warning Status',
        criticalStatus: 'Critical Status',
        sortByDate: 'Sort by Date (Newest)',
        sortByName: 'Sort by Name (A-Z)',
        noResultsFound: 'No Results Found',
        noplantsYet: 'No Plants Yet',
        tryAdjusting: 'Try adjusting your search or filters',
        uploadFirstImage: 'Upload your first geo-tagged plant image to see it on the map!',
        uploadPlant: 'Upload Plant',

        // Health Status
        healthyPlant: 'Healthy Plant',
        needsAttention: 'Needs Attention',
        criticalCondition: 'Critical Condition',
        healthy: 'Healthy',
        warning: 'Warning',
        critical: 'Critical',

        // Analytics
        farmAnalytics: 'Farm Analytics',
        analyticsDescription: 'Comprehensive insights and statistics about your farm',
        recentActivity: 'Recent Activity',
        plantHealthDistribution: 'Plant Health Distribution',
        needAttention: 'Need Attention',
        thisWeek: 'This Week',
        topContributor: 'Top Contributor',
        plantsUploaded: 'plants uploaded',
        last7Days: 'Last 7 days',
        last30Days: 'Last 30 days',
        allTime: 'All time',
        exportCSV: 'Export CSV',
        exportJSON: 'Export JSON',
        viewingStatsFor: 'Viewing stats for',

        // Messages
        pleaseSelectImages: 'Please select at least one image.',
        pleaseEnterEmail: 'Please enter your email before uploading.',
        plantsSavedSuccess: 'plant(s) saved successfully!',
        failedToSave: 'Failed to save some plant locations.',
        confirmDelete: 'Are you sure you want to delete',

        // Footer
        builtWithLove: 'Built with ❤️ for Farmers',

        // Demo Mode
        demoModeActive: 'Demo Mode Active',
        demoModeDesc: 'Upload multiple images to test batch processing! GPS coordinates will be simulated.',
        hybridModeActive: 'Hybrid Mode Active',
        hybridModeDesc: 'Images upload to Cloudinary, GPS coordinates are simulated (CORS bypass). Upload up to 10 images at once!',

        // Farmer Filter
        filterByFarmer: 'Filter by Farmer',
        showMyPlants: 'Show My Plants Only',
        showAllPlants: 'Show All Plants',
        viewingPlants: 'Viewing plants from',
        farmer: 'Farmer',
    },

    hi: {
        // Header
        appName: 'फार्मजियोटैग',
        home: 'होम',
        upload: 'अपलोड',
        analytics: 'विश्लेषण',
        darkMode: 'डार्क मोड',
        lightMode: 'लाइट मोड',
        language: 'भाषा',

        // Dashboard
        myFarmOverview: 'मेरे खेत का अवलोकन',
        farmDescription: 'अपने सभी टैग किए गए पौधों को एक जगह देखें। विवरण के लिए मार्कर पर क्लिक करें या अपने खेत के नक्शे का विस्तार करने के लिए नई जियो-टैग की गई छवियां अपलोड करें।',
        quickStats: 'त्वरित आंकड़े',
        totalPlants: 'कुल पौधे',
        myPlants: 'मेरे पौधे',
        allFarmers: 'सभी किसान',
        lastUpdate: 'अंतिम अपडेट',
        coverage: 'कवरेज',
        status: 'स्थिति',
        recently: 'हाल ही में',
        noData: 'कोई डेटा नहीं',
        good: 'अच्छा',
        growing: 'बढ़ रहा है',
        active: 'सक्रिय',

        // Upload Page
        addNewPlant: 'नया पौधा जोड़ें',
        uploadDescription: 'GPS निर्देशांक स्वचालित रूप से निकालने और इसे अपने खेत के नक्शे में जोड़ने के लिए एक जियो-टैग की गई छवि अपलोड करें।',
        batchUploadPlants: 'बैच अपलोड पौधों की छवियां',
        yourEmail: 'आपका ईमेल (उपयोगकर्ता आईडी)',
        dragDropImages: 'यहां छवियां खींचें और छोड़ें',
        orClickToSelect: 'या चुनने के लिए क्लिक करें (10 छवियों तक)',
        supportsJpgPng: 'GPS डेटा के साथ JPG, PNG समर्थित',
        selectedImages: 'चयनित छवियां',
        readyToUpload: 'अपलोड के लिए तैयार',
        processing: 'प्रसंस्करण...',
        uploadSuccessful: 'अपलोड सफल',
        uploadAll: 'सभी अपलोड करें',
        saveAllToMap: 'सभी को मानचित्र में सहेजें',
        clearAll: 'सभी साफ़ करें',
        deleteEntry: 'प्रविष्टि हटाएं',

        // Map Component
        farmMap: 'खेत का नक्शा',
        plants: 'पौधे',
        plant: 'पौधा',
        filteredFrom: 'से फ़िल्टर किया गया',
        total: 'कुल',
        mapView: 'मानचित्र दृश्य',
        gridView: 'ग्रिड दृश्य',
        searchPlaceholder: 'नाम, ईमेल या निर्देशांक से खोजें...',
        allPlants: 'सभी पौधे',
        recent24h: 'हाल ही में (24 घंटे)',
        healthyPlants: 'स्वस्थ पौधे',
        warningStatus: 'चेतावनी स्थिति',
        criticalStatus: 'गंभीर स्थिति',
        sortByDate: 'तिथि के अनुसार क्रमबद्ध करें (नवीनतम)',
        sortByName: 'नाम के अनुसार क्रमबद्ध करें (A-Z)',
        noResultsFound: 'कोई परिणाम नहीं मिला',
        noplantsYet: 'अभी तक कोई पौधा नहीं',
        tryAdjusting: 'अपनी खोज या फ़िल्टर को समायोजित करने का प्रयास करें',
        uploadFirstImage: 'इसे मानचित्र पर देखने के लिए अपनी पहली जियो-टैग की गई पौधे की छवि अपलोड करें!',
        uploadPlant: 'पौधा अपलोड करें',

        // Health Status
        healthyPlant: 'स्वस्थ पौधा',
        needsAttention: 'ध्यान देने की आवश्यकता है',
        criticalCondition: 'गंभीर स्थिति',
        healthy: 'स्वस्थ',
        warning: 'चेतावनी',
        critical: 'गंभीर',

        // Analytics
        farmAnalytics: 'खेत विश्लेषण',
        analyticsDescription: 'आपके खेत के बारे में व्यापक अंतर्दृष्टि और आंकड़े',
        recentActivity: 'हाल की गतिविधि',
        plantHealthDistribution: 'पौधे स्वास्थ्य वितरण',
        needAttention: 'ध्यान देने की आवश्यकता',
        thisWeek: 'इस सप्ताह',
        topContributor: 'शीर्ष योगदानकर्ता',
        plantsUploaded: 'पौधे अपलोड किए गए',
        last7Days: 'पिछले 7 दिन',
        last30Days: 'पिछले 30 दिन',
        allTime: 'सभी समय',
        exportCSV: 'CSV निर्यात करें',
        exportJSON: 'JSON निर्यात करें',
        viewingStatsFor: 'के लिए आंकड़े देख रहे हैं',

        // Messages
        pleaseSelectImages: 'कृपया कम से कम एक छवि चुनें।',
        pleaseEnterEmail: 'अपलोड करने से पहले कृपया अपना ईमेल दर्ज करें।',
        plantsSavedSuccess: 'पौधे सफलतापूर्वक सहेजे गए!',
        failedToSave: 'कुछ पौधों के स्थान सहेजने में विफल।',
        confirmDelete: 'क्या आप वाकई हटाना चाहते हैं',

        // Footer
        builtWithLove: 'किसानों के लिए ❤️ के साथ बनाया गया',

        // Demo Mode
        demoModeActive: 'डेमो मोड सक्रिय',
        demoModeDesc: 'बैच प्रसंस्करण का परीक्षण करने के लिए कई छवियां अपलोड करें! GPS निर्देशांक सिम्युलेट किए जाएंगे।',
        hybridModeActive: 'हाइब्रिड मोड सक्रिय',
        hybridModeDesc: 'छवियां Cloudinary पर अपलोड होती हैं, GPS निर्देशांक सिम्युलेट किए जाते हैं (CORS बाईपास)। एक बार में 10 छवियों तक अपलोड करें!',

        // Farmer Filter
        filterByFarmer: 'किसान द्वारा फ़िल्टर करें',
        showMyPlants: 'केवल मेरे पौधे दिखाएं',
        showAllPlants: 'सभी पौधे दिखाएं',
        viewingPlants: 'से पौधे देख रहे हैं',
        farmer: 'किसान',
    },

    mr: {
        // Header
        appName: 'फार्मजिओटॅग',
        home: 'मुख्यपृष्ठ',
        upload: 'अपलोड',
        analytics: 'विश्लेषण',
        darkMode: 'डार्क मोड',
        lightMode: 'लाइट मोड',
        language: 'भाषा',

        // Dashboard
        myFarmOverview: 'माझ्या शेताचे विहंगावलोकन',
        farmDescription: 'तुमच्या सर्व टॅग केलेल्या रोपांना एकाच ठिकाणी पहा. तपशीलासाठी मार्करवर क्लिक करा किंवा तुमच्या शेत नकाशाचा विस्तार करण्यासाठी नवीन जिओ-टॅग केलेल्या प्रतिमा अपलोड करा.',
        quickStats: 'द्रुत आकडेवारी',
        totalPlants: 'एकूण रोपे',
        myPlants: 'माझी रोपे',
        allFarmers: 'सर्व शेतकरी',
        lastUpdate: 'शेवटचे अद्यतन',
        coverage: 'कव्हरेज',
        status: 'स्थिती',
        recently: 'अलीकडे',
        noData: 'डेटा नाही',
        good: 'चांगले',
        growing: 'वाढत आहे',
        active: 'सक्रिय',

        // Upload Page
        addNewPlant: 'नवीन रोप जोडा',
        uploadDescription: 'GPS निर्देशांक आपोआप काढण्यासाठी आणि ते तुमच्या शेत नकाशात जोडण्यासाठी जिओ-टॅग केलेली प्रतिमा अपलोड करा.',
        batchUploadPlants: 'बॅच अपलोड रोप प्रतिमा',
        yourEmail: 'तुमचा ईमेल (वापरकर्ता आयडी)',
        dragDropImages: 'येथे प्रतिमा ड्रॅग आणि ड्रॉप करा',
        orClickToSelect: 'किंवा निवडण्यासाठी क्लिक करा (10 प्रतिमांपर्यंत)',
        supportsJpgPng: 'GPS डेटासह JPG, PNG समर्थित',
        selectedImages: 'निवडलेल्या प्रतिमा',
        readyToUpload: 'अपलोड करण्यासाठी तयार',
        processing: 'प्रक्रिया करत आहे...',
        uploadSuccessful: 'अपलोड यशस्वी',
        uploadAll: 'सर्व अपलोड करा',
        saveAllToMap: 'सर्व नकाशात जतन करा',
        clearAll: 'सर्व साफ करा',
        deleteEntry: 'नोंद हटवा',

        // Map Component
        farmMap: 'शेत नकाशा',
        plants: 'रोपे',
        plant: 'रोप',
        filteredFrom: 'पासून फिल्टर केले',
        total: 'एकूण',
        mapView: 'नकाशा दृश्य',
        gridView: 'ग्रिड दृश्य',
        searchPlaceholder: 'नाव, ईमेल किंवा निर्देशांकांद्वारे शोधा...',
        allPlants: 'सर्व रोपे',
        recent24h: 'अलीकडील (24 तास)',
        healthyPlants: 'निरोगी रोपे',
        warningStatus: 'चेतावणी स्थिती',
        criticalStatus: 'गंभीर स्थिती',
        sortByDate: 'तारखेनुसार क्रमवारी लावा (नवीनतम)',
        sortByName: 'नावानुसार क्रमवारी लावा (A-Z)',
        noResultsFound: 'कोणतेही परिणाम सापडले नाहीत',
        noplantsYet: 'अद्याप कोणतेही रोप नाही',
        tryAdjusting: 'तुमचा शोध किंवा फिल्टर समायोजित करण्याचा प्रयत्न करा',
        uploadFirstImage: 'ते नकाशावर पाहण्यासाठी तुमची पहिली जिओ-टॅग केलेली रोप प्रतिमा अपलोड करा!',
        uploadPlant: 'रोप अपलोड करा',

        // Health Status
        healthyPlant: 'निरोगी रोप',
        needsAttention: 'लक्ष देणे आवश्यक',
        criticalCondition: 'गंभीर स्थिती',
        healthy: 'निरोगी',
        warning: 'चेतावणी',
        critical: 'गंभीर',

        // Analytics
        farmAnalytics: 'शेत विश्लेषण',
        analyticsDescription: 'तुमच्या शेताबद्दल सर्वसमावेशक अंतर्दृष्टी आणि आकडेवारी',
        recentActivity: 'अलीकडील क्रियाकलाप',
        plantHealthDistribution: 'रोप आरोग्य वितरण',
        needAttention: 'लक्ष देणे आवश्यक',
        thisWeek: 'या आठवड्यात',
        topContributor: 'शीर्ष योगदानकर्ता',
        plantsUploaded: 'रोपे अपलोड केली',
        last7Days: 'गेले 7 दिवस',
        last30Days: 'गेले 30 दिवस',
        allTime: 'सर्व काळ',
        exportCSV: 'CSV निर्यात करा',
        exportJSON: 'JSON निर्यात करा',
        viewingStatsFor: 'साठी आकडेवारी पाहत आहे',

        // Messages
        pleaseSelectImages: 'कृपया किमान एक प्रतिमा निवडा.',
        pleaseEnterEmail: 'अपलोड करण्यापूर्वी कृपया तुमचा ईमेल प्रविष्ट करा.',
        plantsSavedSuccess: 'रोपे यशस्वीरित्या जतन केली!',
        failedToSave: 'काही रोप स्थाने जतन करण्यात अयशस्वी.',
        confirmDelete: 'तुम्हाला खात्री आहे की तुम्ही हटवू इच्छिता',

        // Footer
        builtWithLove: 'शेतकऱ्यांसाठी ❤️ सह तयार केले',

        // Demo Mode
        demoModeActive: 'डेमो मोड सक्रिय',
        demoModeDesc: 'बॅच प्रक्रियेची चाचणी घेण्यासाठी अनेक प्रतिमा अपलोड करा! GPS निर्देशांक सिम्युलेट केले जातील.',
        hybridModeActive: 'हायब्रिड मोड सक्रिय',
        hybridModeDesc: 'प्रतिमा Cloudinary वर अपलोड होतात, GPS निर्देशांक सिम्युलेट केले जातात (CORS बायपास). एकाच वेळी 10 प्रतिमांपर्यंत अपलोड करा!',

        // Farmer Filter
        filterByFarmer: 'शेतकऱ्यानुसार फिल्टर करा',
        showMyPlants: 'फक्त माझी रोपे दाखवा',
        showAllPlants: 'सर्व रोपे दाखवा',
        viewingPlants: 'पासून रोपे पाहत आहे',
        farmer: 'शेतकरी',
    },
};

export type Language = 'en' | 'hi' | 'mr';
export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (lang: Language, key: TranslationKey): string => {
    // Safety check: default to 'en' if lang is undefined or invalid
    const safeLang = (lang && (lang === 'en' || lang === 'hi' || lang === 'mr')) ? lang : 'en';
    return translations[safeLang]?.[key] || translations.en[key] || key;
};
