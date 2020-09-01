export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Place {
  address?: string;
  googlePlaceId?: string;
  additionalInfo?: string;
  intructions?: string;
  location?: LatLng;
}

export enum OrderStatus {
  Quote = 'quote',
  Matching = 'matching',
  Dispatching = 'dispatching',
  Delivered = 'delivered',
  Canceled = 'canceled',
}

export enum DispatchingState {
  GoingPickUp = 'going-pickup',
  ArrivedPickUp = 'arrived-pickup',
  GoingDestination = 'going-destination',
  ArrivedDestination = 'arrived-destination',
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

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: firebase.firestore.FieldValue;
}

export interface GroupedChatMessages {
  id: string;
  from: string;
  messages: ChatMessage[];
}

export interface Order {
  id: string;
  consumerId: string;
  consumerName?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus | null;
  origin: Place;
  destination: Place;
  routePolyline: string;
  distance: number;
  duration: number;
  fare: Fare;
  courierId?: string;
  courierName: string;
  dispatchingState?: DispatchingState;
  createdOn: firebase.firestore.FieldValue;
  updatedOn?: firebase.firestore.FieldValue;
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
  chatByOrderId: {
    [key: string]: GroupedChatMessages[];
  };
}
