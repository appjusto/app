export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Place {
  address?: string;
  structuredAddress?: {
    main: string;
    secondary?: string;
  };
  googlePlaceId?: string;
  additionalInfo?: string;
  description?: string;
  location?: LatLng;
}

export enum OrderStatus {
  Quote = 'quote',
  Matching = 'matching',
  Dispatching = 'dispatching',
  Delivered = 'delivered',
  Canceled = 'canceled',
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

export interface Order {
  id: string;
  consumerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus | null;
  origin: Place;
  destination: Place;
  routePolyline: string;
  distance: number;
  duration: number;
  fare: Fare;
  courierId?: string;
  createdOn: firebase.firestore.FieldValue;
}

export interface OrderMatchRequest {
  orderId: string;
  courierFee: string;
  distanceToOrigin: number;
  totalDistance: number;
  originAddress: string;
  destinationAddress: string;
}

export interface OrderState {
  orders: Order[];
  ordersById: {
    [key: string]: Order;
  };
}
