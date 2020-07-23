import { t } from '../strings'

export interface ValidationSuccess {
  status: 'ok';
}

export interface ValidationError {
  status: 'error';
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationError;

export const validateEmail = (email:string): ValidationResult => {
  if (!email || email.length === 0) return { status: "error", message: t('E-mail não é válido') };
  return { status: 'ok' }
}