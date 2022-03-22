import { t } from '../../strings';

export interface ValidationSuccess {
  status: 'ok';
}

export interface ValidationError {
  status: 'error';
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationError;

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const domainRegex = /.com\w/;
  const commonTypos = [
    'gnail.com',
    'gamil.com',
    'gmil.com',
    'gail.com',
    'gmai.com',
    'gmail.com.br',
    'gemail.com',
    'gmail.xom',
    'outloo.com',
    'putlook.com',
    'hotrmail.com',
    'hormail.com',
    'hotmaio.com',
    'hotmil.com',
  ]; // add here if you think of more cases
  const match = emailRegex.exec(email);
  if (!match) return { status: 'error', message: t('E-mail não é válido') };
  const domain = match[5];
  if (
    domain.endsWith('.com.com') ||
    domain.endsWith('.co') ||
    domain.endsWith('.con') ||
    domainRegex.test(domain) ||
    commonTypos.includes(domain)
  )
    return { status: 'error', message: t('E-mail não é válido') };
  return { status: 'ok' };
};
