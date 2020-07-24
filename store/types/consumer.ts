export interface Consumer {
  id: string;
  location?: Coordinates;
  notificationToken?: string;
}

export interface ConsumerState {
  consumer: Consumer;
  ongoingOrders: object[] | null;
}