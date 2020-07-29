export interface Consumer {
  id: string;
  location?: Coordinates;
  notificationToken?: string;
}

export interface ConsumerState {
  email?: string;
  consumer?: Consumer;
  ongoingOrders?: object[];
}
