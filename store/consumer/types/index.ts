import { UserProfile, ProfileInfo } from '../../user/types';
import Consumer from './Consumer';

export interface ConsumerInfo extends ProfileInfo {}

export interface ConsumerProfile extends UserProfile {
  paymentChannelId?: string;
  cards: object[];
}

export interface ConsumerState {
  consumer?: Consumer;
}
