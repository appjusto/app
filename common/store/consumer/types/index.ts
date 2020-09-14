import Consumer from './Consumer';

export interface SaveCardPayload {
  holderName: string;
  holderDocument: string;
  number: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
}

export interface ConsumerState {
  consumer?: Consumer;
}
