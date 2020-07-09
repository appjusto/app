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

  //Confirmation
  code: 'Código de confirmação',
  typeCode: 'Digite o código',
  sendAgain: 'Enviar confirmação novamente',
  confirmationCode: 'Um código de acesso foi enviado para o seu número.',
  email: 'E-mail',
  linkEmail: 'Enviaremos um link de confirmação para o seu e-mail.',
  typeEmail: 'Digite seu e-mail',
  send: 'Enviar',

  //Register
  soon: 'Assim que sua conta for criada você já poderá fazer pedidos.',


  //Order
  origin: 'Retirada',
  desination: 'Entrega',
  confirmation: 'Confirmação',
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
export const t = (string) => i18n.t(string) || string;

