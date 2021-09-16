import { Environment } from '@appjusto/types';

export const getBaseDomain = (environment: Environment) =>
  `${environment === 'live' ? '' : `${environment}.`}appjusto.com.br`;

export const getDeeplinkDomain = (environment: Environment) =>
  `${environment.charAt(0)}.deeplink.appjusto.com.br`;

export const getFallbackDomain = (environment: Environment) =>
  `${environment === 'live' ? '' : `${environment}.`}login.appjusto.com.br`;
