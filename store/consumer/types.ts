export interface Consumer {
  id: string;
  name?: string;
  email?: string;
  notificationToken?: string;
}

export interface ConsumerState {
  consumer?: Consumer;
  ongoingOrders?: object[];
}
