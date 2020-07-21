import { Order, OrderStatus, PaymentStatus } from "./types";

export const orderStatusQuote:Order = {
  customerId: 'G6fP8yjKiYfWalpqD9t4',
  status: OrderStatus.Quote,
  places: [{
    address: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200, Brasil'
  }, {
    address: 'Largo de São Bento - Centro Histórico de São Paulo, São Paulo - SP, 01029-010, Brasil'
  }],
  distance: { text: '4,2 km', value: 4246 },
  duration: { text: '13 minutos', value: 792 },
  fare: {
    total: 900
  },
  routePolyline: 'l{xnCvow{GyJdLmNpPQLGBoCzCo@r@',
  paymentStatus: null,
};