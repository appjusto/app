export interface Consumer {
  id: string;
  name?: string;
  notificationToken?: string;
}

export interface ConsumerState {
  consumer?: Consumer;
  ongoingOrders?: object[];
}
