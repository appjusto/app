import {
  CancelOrderPayload,
  CompleteDeliveryPayload,
  DeleteCardPayload,
  DropOrderPayload,
  Fare,
  FetchAccountInformationPayload,
  FetchAccountInformationResponse,
  FetchAdvanceByAmountSimulationPayload,
  FetchAdvanceSimulationPayload,
  FetchReceivablesPayload,
  GetCancellationInfoPayload,
  GetCancellationInfoResult,
  GetOrderQuotesPayload,
  MatchOrderPayload,
  NextDispatchingStatePayload,
  PlaceOrderPayload,
  QueryGoogleMapsPayload,
  RejectOrderPayload,
  RequestWithdrawPayload,
  SaveCardResponse,
  SaveIuguCardPayload,
  TipCourierPayload,
} from '@appjusto/types';
import {
  IuguMarketplaceAccountAdvanceByAmountSimulation,
  IuguMarketplaceAccountAdvanceSimulation,
  IuguMarketplaceAccountReceivables,
  IuguMarketplaceAccountWithdrawResponse,
} from '@appjusto/types/payment/iugu';
import { Functions, httpsCallable } from 'firebase/functions';

export class FunctionsRef {
  constructor(private functions: Functions) {}
  getVerifyProfileCallable = () => httpsCallable(this.functions, 'verifyProfile');
  getFetchAccountInformationCallable = () =>
    httpsCallable<FetchAccountInformationPayload, FetchAccountInformationResponse>(
      this.functions,
      'fetchAccountInformation'
    );
  getFetchReceivablesCallable = () =>
    httpsCallable<FetchReceivablesPayload, IuguMarketplaceAccountReceivables>(
      this.functions,
      'fetchReceivables'
    );
  getFetchAdvanceSimulationCallable = () =>
    httpsCallable<FetchAdvanceSimulationPayload, IuguMarketplaceAccountAdvanceSimulation>(
      this.functions,
      'fetchAdvanceSimulation'
    );
  getFetchAdvanceByAmountSimulationCallable = () =>
    httpsCallable<
      FetchAdvanceByAmountSimulationPayload,
      IuguMarketplaceAccountAdvanceByAmountSimulation
    >(this.functions, 'fetchAdvanceByAmountSimulation');
  getRequestWithdrawCallable = () =>
    httpsCallable<RequestWithdrawPayload, IuguMarketplaceAccountWithdrawResponse>(
      this.functions,
      'requestWithdraw'
    );
  getAdvanceReceivablesCallable = () => httpsCallable(this.functions, 'advanceReceivables');
  getAdvanceReceivablesByAmountCallable = () =>
    httpsCallable(this.functions, 'advanceReceivablesByAmount');
  getDeleteAccountCallable = () => httpsCallable(this.functions, 'deleteAccount');
  getServerTimeCallable = () => httpsCallable(this.functions, 'getServerTime');
  // consumer
  getSaveCardCallable = () =>
    httpsCallable<SaveIuguCardPayload, SaveCardResponse>(this.functions, 'saveCard');
  getDeleteCardCallable = () =>
    httpsCallable<DeleteCardPayload, void>(this.functions, 'deleteCard');
  getCreateOrderCallable = () => httpsCallable(this.functions, 'createOrder');
  getGetOrderQuotesCallable = () =>
    httpsCallable<GetOrderQuotesPayload, Fare[]>(this.functions, 'getOrderQuotes');
  getPlaceOrderCallable = () =>
    httpsCallable<PlaceOrderPayload, void>(this.functions, 'placeOrder');
  getCancelOrderCallable = () =>
    httpsCallable<CancelOrderPayload, void>(this.functions, 'cancelOrder');
  getTipCourierCallable = () =>
    httpsCallable<TipCourierPayload, void>(this.functions, 'tipCourier');
  getCancellationInfoCallable = () =>
    httpsCallable<GetCancellationInfoPayload, GetCancellationInfoResult>(
      this.functions,
      'getCancellationInfo'
    );
  getQueryGoogleMapsCallable = () =>
    httpsCallable<QueryGoogleMapsPayload, any>(this.functions, 'queryGoogleMaps');
  // courier
  getMatchOrderCallable = () =>
    httpsCallable<MatchOrderPayload, void>(this.functions, 'matchOrder');
  getRejectOrderCallable = () =>
    httpsCallable<RejectOrderPayload, void>(this.functions, 'rejectOrder');
  getDropOrderCallable = () => httpsCallable<DropOrderPayload, void>(this.functions, 'dropOrder');
  getNextDispatchingStateCallable = () =>
    httpsCallable<NextDispatchingStatePayload, void>(this.functions, 'nextDispatchingState');
  getCompleteDeliveryCallable = () =>
    httpsCallable<CompleteDeliveryPayload, void>(this.functions, 'completeDelivery');

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
