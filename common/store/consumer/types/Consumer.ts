import { ConsumerProfile, Card } from 'appjusto-types';

import User from '../../user/types/User';

export default class Consumer extends User {
  constructor(protected source: ConsumerProfile) {
    super(source);
  }

  public getSource(): ConsumerProfile {
    return this.source;
  }

  public merge(newSource: ConsumerProfile): User {
    return new Consumer(Object.assign({}, this.source, newSource));
  }

  public getCards(): Card[] {
    return this.source.cards ?? [];
  }

  public getCardById(cardId: string): Card | undefined {
    return this.getCards().find((card) => card.id === cardId);
  }

  public getLastCard(): Card | undefined {
    if (this.source.lastCardId) return this.getCardById(this.source.lastCardId);
    return undefined;
  }
}
