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
  part: 'Faça parte desse movimento',
  register: 'Cadastre-se agora',


  //Order
  origin: 'Retirada',
  desination: 'Entrega',
  confirmation: 'Confirmação',
  originAddressTitle: 'Endereço de retirada',
  destinationAddressTitle: 'Endereço de entrega',
  addressPlaceholder: 'Endereço com número',
  infoTitle: 'Complemento (se houver)',
  infoPlaceholder: 'Apartamento, sala, loja, etc.',
  originInstructionsTitle: 'Instruções de retirada',
  originInstructionsPlaceholder: 'Informe com quem e o quê deve ser retirado',
  destinationInstructionsTitle: 'Instruções para entrega',
  destinationInstructionsPlaceholder: 'Informe para quem deve ser entregue',
  timeEstimate: 'Tempo aprox.',
  distance: 'Distância',
  price: 'Valor da entrega',
  confirmOrigin: 'Confirmar local de retirada',
  confirmOrigin: 'Confirmar local de entrega',
  confirmOrigin: 'Confirmar pedido',
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
  part: 'Be a part of this movement',
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
export const t = (string) => i18n.t(string) || string;

