export interface Consumer {
  id: string;
  location?: Coordinates;
  notificationToken?: string;
}

export interface ConsumerState {
  auth?: object;
  consumer?: Consumer;
  ongoingOrders?: object[];
}
