export interface Consumer {
  notificationToken?: string;
}

export interface ConsumerState {
  consumer?: Consumer;
  ongoingOrders?: object[];
}
