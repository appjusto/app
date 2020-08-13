import { UserProfile, ProfileInfo } from '../../user/types';
import Consumer from './Consumer';

export interface SaveCardPayload {
  holderName: string;
  holderDocument: string;
  number: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
}

export interface Card {
  id: string;
  holderName: string;
  holderDocument: string;
  lastFourDigits: string;
  expirationMonth: string;
  expirationYear: string;
  brand: string;
}

export interface ConsumerInfo extends ProfileInfo {
  paymentChannelId?: string;
  lastCardId?: string;
  cards?: Card[];
}

export interface ConsumerProfile extends UserProfile {
  info?: ConsumerInfo;
}

export interface ConsumerState {
  consumer?: Consumer;
}
