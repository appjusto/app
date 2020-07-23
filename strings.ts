import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const pt = {
};

const en = {
  'Endereço de retirada': 'Source address',
  'Endereço com número': 'Address with number',
  'Pronto': 'Done',
};

i18n.fallbacks = false;
i18n.translations = { pt };
i18n.defaultLocale = 'pt';

export const translations = ['pt']; // Object.keys(i18n.translations);
const deviceLocale = Localization.locale.substr(0, 2); // to strip out country codes (pt-BR -> pt)
const isDeviceLocaleSupported = translations.indexOf(deviceLocale) > -1;

i18n.locale = isDeviceLocaleSupported ? deviceLocale : i18n.defaultLocale;

i18n.missingTranslation = () => null;

export const { locale } = i18n;
export const t = (string: string) => i18n.t(string) || string;

