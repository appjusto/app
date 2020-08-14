import { isEmpty } from 'lodash';

import { ConsumerProfile, Card } from '.';
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

  public merge(newSource: ConsumerProfile): User {
    return new Consumer(Object.assign({}, this.source, newSource));
  }

  public getCards(): Card[] {
    return this.info?.cards ?? [];
  }

  public getCardById(cardId: string): Card | undefined {
    return this.getCards().find((card) => card.id === cardId);
  }

  public getLastCard(): Card | undefined {
    if (this.info?.lastCardId) return this.getCardById(this.info.lastCardId);
    return undefined;
  }
}
