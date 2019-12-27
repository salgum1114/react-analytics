import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import {
    localeKO,
    localeEN,
} from '../locales';

/**
 * Client Side Load
 */
const i18nClient = i18n
    .use(LanguageDetector)
    .init({
        load: 'languageOnly',
        whitelist: ['en', 'en-US', 'ko', 'ko-KR'],
        nonExplicitWhitelist: false,
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false, // not needed for react!!
        },
        react: {
            wait: true, // set to true if you like to wait for loaded in every translated hoc
            nsMode: 'default', // set it to fallback to let passed namespaces to translated hoc act as fallbacks
        },
        defaultNS: 'locale.constant',
        resources: {
            'en': {
                'locale.constant': localeEN,
            },
            'en-US': {
                'locale.constant': localeEN,
            },
            'ko': {
                'locale.constant': localeKO,
            },
            'ko-KR': {
                'locale.constant': localeKO,
            },
        },
    });

export default () => i18nClient;
