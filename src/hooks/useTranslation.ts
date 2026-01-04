import { useAppSelector } from './redux';
import { getTranslation, type TranslationKey } from '../i18n/translations';

export const useTranslation = () => {
    const language = useAppSelector((state) => state.settings.language);

    const t = (key: TranslationKey): string => {
        return getTranslation(language, key);
    };

    return { t, language };
};
