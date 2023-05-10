import { FirebaseFunctionsTypes } from '@react-native-firebase/functions';

export class FunctionsRef {
  constructor(private functions: FirebaseFunctionsTypes.Module) {}

  getVerifyProfileCallable = () => this.functions.httpsCallable('verifyProfile');
  getFetchAccountInformationCallable = () =>
    this.functions.httpsCallable('fetchAccountInformation');
  getFetchReceivablesCallable = () => this.functions.httpsCallable('fetchReceivables');
  getFetchAdvanceSimulationCallable = () => this.functions.httpsCallable('fetchAdvanceSimulation');
  getFetchAdvanceByAmountSimulationCallable = () =>
    this.functions.httpsCallable('fetchAdvanceByAmountSimulation');
  getRequestWithdrawCallable = () => this.functions.httpsCallable('requestWithdraw');
  getAdvanceReceivablesCallable = () => this.functions.httpsCallable('advanceReceivables');
  getAdvanceReceivablesByAmountCallable = () =>
    this.functions.httpsCallable('advanceReceivablesByAmount');
  getDeleteAccountCallable = () => this.functions.httpsCallable('deleteAccount');
  getServerTimeCallable = () => this.functions.httpsCallable('getServerTime');

  // consumer
  getSavePaymentTokenCallable = () => this.functions.httpsCallable('savePaymentToken');
  getDeletePaymentMethodCallable = () => this.functions.httpsCallable('deletePaymentMethod');
  getGetOrderQuotesCallable = () => this.functions.httpsCallable('getOrderQuotes');
  getPlaceOrderCallable = () => this.functions.httpsCallable('placeOrder');
  getCancelOrderCallable = () => this.functions.httpsCallable('cancelOrder');
  getCancellationInfoCallable = () => this.functions.httpsCallable('getCancellationInfo');
  getUpdateOrderCallable = () => this.functions.httpsCallable('updateOrder');
  getQueryGoogleMapsCallable = () => this.functions.httpsCallable('queryGoogleMaps');

  // courier
  getMatchOrderCallable = () => this.functions.httpsCallable('matchOrder');
  getRejectOrderCallable = () => this.functions.httpsCallable('rejectOrder');
  getDropOrderCallable = () => this.functions.httpsCallable('dropOrder');
  getNextDispatchingStateCallable = () => this.functions.httpsCallable('nextDispatchingState');
  getCompleteDeliveryCallable = () => this.functions.httpsCallable('completeDelivery');

  // storage
  // courier
  getCourierSelfiePath = (courierId: string, size?: string) =>
    `couriers/${courierId}/selfie${size ? `_${size}` : ''}.jpg`;
  getCourierDocumentPath = (courierId: string, size?: string) =>
    `couriers/${courierId}/document${size ? `_${size}` : ''}.jpg`;

  // consumer
  getConsumerStoragePath = (consumerId: string) => `consumers/${consumerId}`;
  // getConsumerSelfieStoragePath = (consumerId: string, size?: string) =>
  //   `${this.getConsumerStoragePath(consumerId)}/selfie${size ? `${size}` : ''}.jpg`;
  getConsumerSelfieStoragePath = (consumerId: string, size?: string) =>
    `consumers/${consumerId}/selfie${size ? `_${size}` : ''}.jpg`;
  // getConsumerDocumentStoragePath = (consumerId: string, size?: string) =>
  //   `${this.getConsumerStoragePath(consumerId)}/document${size ? `${size}` : ''}.jpg`;
  getConsumerDocumentStoragePath = (consumerId: string, size?: string) =>
    `consumers/${consumerId}/document${size ? `_${size}` : ''}.jpg`;

  // orders
  getOrderPODPackagePath = (orderId: string, courierId: string) =>
    `orders/${orderId}/${courierId}/package.jpg`;
  getOrderPODFrontPath = (orderId: string, courierId: string) =>
    `orders/${orderId}/${courierId}/front.jpg`;

  // business
  getBusinessStoragePath = (businessId: string) => `businesses/${businessId}`;
  getBusinessLogoUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo.jpg`;
  getBusinessLogoStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo_240x240.jpg`;
  getBusinessCoverUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover.jpg`;
  getBusinessCoverStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover_1008x360.jpg`;
  getProductsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/products`;
  getProductImageStoragePath = (businessId: string, productId: string, size: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}_${size}.jpg`;
  getComplementsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/complements`;
  getComplementUploadStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_288x288.jpg`;
  getComplementImageStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_288x288.jpg`;
}
