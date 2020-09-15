import { ConsumerProfile } from 'appjusto-types';

export interface SaveCardPayload {
  holderName: string;
  holderDocument: string;
  number: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
}

export interface ConsumerState {
  consumer?: ConsumerProfile;
}
