export enum OrderStatus {
  Quote = 'quote',
  Matching = 'matching',
  Dispatching = 'dispatching',
  Delivered = 'delivered',
}

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

export interface Identifiable {
  id: string;
}

export interface Courier extends Identifiable {
  
}

export interface LatLng {
  latitude: string;
  longitude: string;
}

export interface Place {
  address: string;
  additionalInfo?: string;
  description?: string;
  location?: LatLng;
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
  customerId: string;
  status: OrderStatus | FoodOrderStatus;
  paymentStatus: PaymentStatus | null;
  places: Place[];
  routePolyline: string;
  distance: OrderDistance;
  duration: OrderDuration;
  fare: FareDetails;
  courierId?: string;
}