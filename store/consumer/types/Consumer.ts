import { UserProfile } from '../../user/types';
import User from '../../user/types/User';

export interface ConsumerProfile extends UserProfile {}

export default class Consumer extends User {
  constructor(protected source: ConsumerProfile) {
    super(source);
  }

  public getSource(): ConsumerProfile {
    return this.source;
  }
}
