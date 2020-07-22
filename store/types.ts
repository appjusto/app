// base

export interface Coordinates {
  latitude: string;
  longitude: string;
}

// couriers

export enum OrderStatus {
  Quote = 'quote',
  Matching = 'matching',
  Dispatching = 'dispatching',
  Delivered = 'delivered',
}

// orders

export enum FoodOrderStatus {
  Quote = 'quote',
  Matching = 'matching',
  Confirming = 'confirming',
  Preparing = 'preparing',
  Dispatching = 'dispatching',
  Delivered = 'delivered',
}

export enum PaymentStatus {
  AuthorizedPendingCapture = 'authorized_pending_capture',
  Captured = 'captured',
  Refunded = 'refunded',
  Failed = 'failed',
  NotAuthorized = 'not_authorized',
}

export interface Place {
  address: string;
  additionalInfo?: string;
  description?: string;
  location?: Coordinates;
}

export interface FareDetails {
  total: number;
}

export interface OrderDistance {
  text: string;
  value: number;
}

export interface OrderDuration {
  text: string;
  value: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus | FoodOrderStatus;
  paymentStatus: PaymentStatus | null;
  origin: Place;
  destination: Place;
  routePolyline: string;
  distance: OrderDistance;
  duration: OrderDuration;
  fare: FareDetails;
  courierId?: string;
}