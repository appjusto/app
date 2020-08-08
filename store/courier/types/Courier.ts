import { CourierProfile } from '.';
import User from '../../user/types/User';

export default class Courier extends User {
  constructor(protected source: CourierProfile) {
    super(source);
  }

  public get status() {
    return this.source.status;
  }

  public get info() {
    return this.source.info;
  }

  public getSource(): CourierProfile {
    return this.source;
  }
}
