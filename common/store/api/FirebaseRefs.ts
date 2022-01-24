import firebase from 'firebase/app';

export default class FirebaseRefs {
  constructor(
    private functions: firebase.functions.Functions,
    private firestore: firebase.firestore.Firestore
  ) {}

  // functions
  getVerifyProfileCallable = () => this.functions.httpsCallable('verifyProfile');
  getFetchAccountInformationCallable = () =>
    this.functions.httpsCallable('fetchAccountInformation');
  getFetchReceivablesCallable = () => this.functions.httpsCallable('fetchReceivables');
  getFetchAdvanceSimulationCallable = () => this.functions.httpsCallable('fetchAdvanceSimulation');
  getRequestWithdrawCallable = () => this.functions.httpsCallable('requestWithdraw');
  getAdvanceReceivablesCallable = () => this.functions.httpsCallable('advanceReceivables');
  getDeleteAccountCallable = () => this.functions.httpsCallable('deleteAccount');
  getServerTimeCallable = () => this.functions.httpsCallable('getServerTime');
  // consumer
  getSavePaymentTokenCallable = () => this.functions.httpsCallable('savePaymentToken');
  getDeletePaymentMethodCallable = () => this.functions.httpsCallable('deletePaymentMethod');
  getCreateOrderCallable = () => this.functions.httpsCallable('createOrder');
  getGetOrderQuotesCallable = () => this.functions.httpsCallable('getOrderQuotes');
  getPlaceOrderCallable = () => this.functions.httpsCallable('placeOrder');
  getCancelOrderCallable = () => this.functions.httpsCallable('cancelOrder');
  getTipCourierCallable = () => this.functions.httpsCallable('tipCourier');
  getCancellationInfoCallable = () => this.functions.httpsCallable('getCancellationInfo');
  getUpdateOrderCallable = () => this.functions.httpsCallable('updateOrder');
  // courier
  getMatchOrderCallable = () => this.functions.httpsCallable('matchOrder');
  getRejectOrderCallable = () => this.functions.httpsCallable('rejectOrder');
  getDropOrderCallable = () => this.functions.httpsCallable('dropOrder');
  getNextDispatchingStateCallable = () => this.functions.httpsCallable('nextDispatchingState');
  getCompleteDeliveryCallable = () => this.functions.httpsCallable('completeDelivery');

  // firestore
  // recommendations
  getRecommendationsRef = () => this.firestore.collection('recommendations');

  // withdraws
  getWithdrawsRef = () => this.firestore.collection('withdraws');

  // platform
  getPlatformRef = () => this.firestore.collection('platform');

  // platform docs
  getPlatformParamsRef = () => this.getPlatformRef().doc('params');
  getPlatformStatisticsRef = () => this.getPlatformRef().doc('statistics');
  getPlatformCitiesStatisticsRef = () => this.getPlatformStatisticsRef().collection('cities');
  getPlatformCityStatisticsRef = (name: string) => this.getPlatformCitiesStatisticsRef().doc(name);
  getPlatformDatasRef = () => this.getPlatformRef().doc('data');
  getPlatformLogsRef = () => this.getPlatformRef().doc('logs');
  getPlatformAccessRef = () => this.getPlatformRef().doc('access');

  // platform data subcollections
  getBanksRef = () => this.getPlatformDatasRef().collection('banks');
  getIssuesRef = () => this.getPlatformDatasRef().collection('issues');
  getCuisinesRef = () => this.getPlatformDatasRef().collection('cuisines');
  getClassificationsRef = () => this.getPlatformDatasRef().collection('classifications');

  // platform logs subcollections
  getPlatformLoginLogsRef = () => this.getPlatformLogsRef().collection('logins');

  // businesses
  getBusinessesRef = () => this.firestore.collection('businesses');
  getBusinessRef = (id: string) => this.getBusinessesRef().doc(id);

  // business menu
  getBusinessMenuMessageRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('menu').doc('message');
  getBusinessCategoriesRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('categories');
  getBusinessCategoryRef = (businessId: string, categoryId: string) =>
    this.getBusinessCategoriesRef(businessId).doc(categoryId);
  getBusinessProductsRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('products');
  getBusinessProductRef = (businessId: string, id: string) =>
    this.getBusinessProductsRef(businessId).doc(id);
  getBusinessComplementsGroupsRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('complementsgroups');
  getBusinessComplementGroupRef = (businessId: string, groupId: string) =>
    this.getBusinessComplementsGroupsRef(businessId).doc(groupId);
  getBusinessComplementsRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('complements');
  getBusinessComplementRef = (businessId: string, complementId: string) =>
    this.getBusinessComplementsRef(businessId).doc(complementId);
  getBusinessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
    this.getBusinessRef(businessId).collection('menu').doc(menuId);

  // managers
  getManagersRef = () => this.firestore.collection('managers');
  getManagerRef = (managerId: string) => this.firestore.collection('managers').doc(managerId);

  // orders
  getOrdersRef = () => this.firestore.collection('orders');
  getOrderRef = (id: string) => this.getOrdersRef().doc(id);
  getOrderChatRef = (id: string) => this.getOrdersRef().doc(id).collection('chat');
  getOrderChatMessageRef = (orderId: string, id: string) => this.getOrderChatRef(orderId).doc(id);
  getOrderIssuesRef = (id: string) => this.getOrdersRef().doc(id).collection('issues');
  getOrderPrivateRef = (id: string) => this.getOrdersRef().doc(id).collection('private');
  getOrderCancellationRef = (orderId: string) =>
    this.getOrderPrivateRef(orderId).doc('cancellation');
  getOrderConfirmationRef = (id: string) => this.getOrderPrivateRef(id).doc('confirmation');
  getOrderLogsRef = (id: string) => this.getOrderRef(id).collection('logs');

  // consumers
  getConsumersRef = () => this.firestore.collection('consumers');
  getConsumerRef = (id: string) => this.getConsumersRef().doc(id);

  // users
  getUsersRef = () => this.firestore.collection('users');
  getUsersSubcollectionsRef = () => this.getUsersRef().doc('subcollections');
  getUsersChangesRef = () => this.getUsersSubcollectionsRef().collection('changes');

  // couriers
  getCouriersRef = () => this.firestore.collection('couriers');
  getCourierRef = (id: string) => this.getCouriersRef().doc(id);
  getCourierReviewsRef = (id: string) => this.getCourierRef(id).collection('reviews');
  getCourierRequestsRef = (id: string) => this.getCourierRef(id).collection('requests');
  getCourierOrderRequestsRef = (courierId: string, orderId: string) =>
    this.getCourierRequestsRef(courierId).doc(orderId);

  // fleets
  getFleetsRef = () => this.firestore.collection('fleets');
  getFleetRef = (id: string) => this.getFleetsRef().doc(id);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');

  // storage
  // courier
  getCourierSelfiePath = (courierId: string, size?: string) =>
    `couriers/${courierId}/selfie${size ? `_${size}` : ''}.jpg`;
  getCourierDocumentPath = (courierId: string, size?: string) =>
    `couriers/${courierId}/document${size ? `_${size}` : ''}.jpg`;

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
