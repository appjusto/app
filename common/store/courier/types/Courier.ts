import { CourierProfile } from 'appjusto-types';
import { isEmpty } from 'lodash';

import User from '../../user/types/User';

export default class Courier extends User {
  constructor(protected source: CourierProfile) {
    super(source);
  }

  public get status() {
    return this.source.status;
  }

  public get situation() {
    return this.source.situation;
  }

  public get bankAccount() {
    return this.source.bankAccount;
  }

  public get fleet() {
    return this.source.fleet;
  }

  public getSource(): CourierProfile {
    return this.source;
  }

  public merge(newSource: CourierProfile): User {
    return new Courier(Object.assign({}, this.source, newSource));
  }

  public personalInfoSet(): boolean {
    return (
      super.personalInfoSet() &&
      !isEmpty(this.name) &&
      !isEmpty(this.surname) &&
      !isEmpty(this.cpf) &&
      !isEmpty(this.phone)
    );
  }

  public bankAccountSet(): boolean {
    return (
      !isEmpty(this.bankAccount?.id) &&
      !isEmpty(this.bankAccount?.name) &&
      !isEmpty(this.bankAccount?.agency) &&
      !isEmpty(this.bankAccount?.account) &&
      !isEmpty(this.bankAccount?.digit)
    );
  }
}
