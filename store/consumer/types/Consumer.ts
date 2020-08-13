import { isEmpty } from 'lodash';

import { ConsumerProfile } from '.';
import User from '../../user/types/User';

export default class Consumer extends User {
  constructor(protected source: ConsumerProfile) {
    super(source);
  }

  public get info() {
    return this.source.info;
  }

  public getSource(): ConsumerProfile {
    return this.source;
  }

  public paymentInfoSet(): boolean {
    return !isEmpty(this.info?.paymentChannelId) && !!this.info?.cards?.length;
  }
}
