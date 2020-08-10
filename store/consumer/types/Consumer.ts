import { ConsumerProfile } from '.';
import User from '../../user/types/User';

export default class Consumer extends User {
  constructor(protected source: ConsumerProfile) {
    super(source);
  }

  public getSource(): ConsumerProfile {
    return this.source;
  }
}
