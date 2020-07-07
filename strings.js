import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const pt = {
  //Consumer

  //Intro
  weAre: 'Somos um delivery aberto, transparente e consciente.',
  platform: 'A plataforma de entregas mais justa, transparente e aberta disponível.',
  enter: 'Entrar',
  access: 'Acesse sua conta',
  cellPhone: 'Digite seu celular',
  yourEmail: 'Entrar usando seu e-mail',
  part: 'Faça parte desse movimento →',
};

const en = {
  //Consumer

  //Intro
  weAre: 'We are an open, transparent and conscious delivery app.',
  platform: 'The most fair, transparent and open delivery platform available.',
  enter: 'Enter',
  access: 'Access your account',
  cellPhone: 'Enter your cell phone number',
  yourEmail: 'Log in using your email',
  part: 'Be a part of this movement →',
};

i18n.fallbacks = true;
i18n.translations = { en, pt };
i18n.defaultLocale = 'pt';

export const translations = ['pt', 'en']; // Object.keys(i18n.translations);
const deviceLocale = Localization.locale.substr(0, 2); // to strip out country codes (pt-BR -> pt)
const isDeviceLocaleSupported = translations.indexOf(deviceLocale) > -1;

i18n.locale = isDeviceLocaleSupported ? deviceLocale : i18n.defaultLocale;

export const { t, locale } = i18n;
