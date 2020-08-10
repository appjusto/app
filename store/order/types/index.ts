export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Place {
  address: string;
  additionalInfo?: string;
  description?: string;
  location: LatLng;
}

export enum OrderStatus {
  Quote = 'quote',
  Matching = 'matching',
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

export interface Fare {
  courierFee: number; // in BRL
  platformFee: number; // in BRL
  taxes: number; // in BRL
  financialFee: number; // in BRL
  total: number; // in BRL
}

export interface OrderRequest {
  origin: Place;
  destination: Place;
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
  consumerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus | null;
  origin: Place;
  destination: Place;
  routePolyline: string;
  distance: OrderDistance;
  duration: OrderDuration;
  fare: Fare;
  courierId?: string;
  timestamp: firebase.firestore.FieldValue;
}

export interface OrderMatchRequest {
  orderId: string;
  fare: number;
  distance: {
    toOrigin: number;
    route: string;
  };
  origin: {
    address: string;
  };
  destination: {
    address: string;
  };
}

export interface OrderState {
  orders: Order[];
}
