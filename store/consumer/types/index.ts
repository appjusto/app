import Consumer from './Consumer';

export interface ConsumerState {
  consumer?: Consumer;
  ongoingOrders?: object[];
}
