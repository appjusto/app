import firebase from 'firebase/app';

export default class FirebaseRefs {
  constructor(
    private functions: firebase.functions.Functions,
    private firestore: firebase.firestore.Firestore
  ) {}

  // functions
  getSubmitProfileCallable = () => this.functions.httpsCallable('submitProfile');
  getDeleteAccountCallable = () => this.functions.httpsCallable('deleteAccount');
  // consumer
  getFetchTotalCouriersNearbyCallable = () =>
    this.functions.httpsCallable('fetchTotalCouriersNearby');
  getSavePaymentTokenCallable = () => this.functions.httpsCallable('savePaymentToken');
  getDeletePaymentMethodCallable = () => this.functions.httpsCallable('deletePaymentMethod');
  getCreateOrderCallable = () => this.functions.httpsCallable('createOrder');
  getGetOrderQuotesCallable = () => this.functions.httpsCallable('getOrderQuotes');
  getPlaceOrderCallable = () => this.functions.httpsCallable('placeOrder');
  getCancelOrderCallable = () => this.functions.httpsCallable('cancelOrder');
  getTipCourierCallable = () => this.functions.httpsCallable('tipCourier');
  getSendOrderProblemCallable = () => this.functions.httpsCallable('sendOrderProblem');
  getSendCourierReviewCallable = () => this.functions.httpsCallable('sendCourierReview');
  // courier
  getMatchOrderCallable = () => this.functions.httpsCallable('matchOrder');
  getRejectOrderCallable = () => this.functions.httpsCallable('rejectOrder');
  getNextDispatchingStateCallable = () => this.functions.httpsCallable('nextDispatchingState');
  getCompleteDeliveryCallable = () => this.functions.httpsCallable('completeDelivery');
  getSendCourierOrderProblemCallable = () =>
    this.functions.httpsCallable('sendCourierOrderProblem');

  // firestore
  // platform
  getPlatformRef = () => this.firestore.collection('platform');

  // platform docs
  getPlatformParamsRef = () => this.getPlatformRef().doc('params');
  getPlatformStatisticsRef = () => this.getPlatformRef().doc('statistics');
  getPlatformDatasRef = () => this.getPlatformRef().doc('data');

  // platform data subcollections
  getBanksRef = () => this.getPlatformDatasRef().collection('banks');
  getIssuesRef = () => this.getPlatformDatasRef().collection('issues');
  getCuisinesRef = () => this.getPlatformDatasRef().collection('cuisines');

  // businesses
  getBusinessesRef = () => this.firestore.collection('businesses');
  getBusinessRef = (id: string) => this.getBusinessesRef().doc(id);

  // business menu
  getBusinessCategoriesRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('categories');
  getBusinessCategoryRef = (businessId: string, categoryId: string) =>
    this.getBusinessCategoriesRef(businessId).doc(categoryId);
  getBusinessProductsRef = (businessId: string) =>
    this.getBusinessRef(businessId).collection('products');
  getBusinessProductRef = (businessId: string, id: string) =>
    this.getBusinessProductsRef(businessId).doc(id);
  getBusinessProductComplementsGroupsRef = (businessId: string, productId: string) =>
    this.getBusinessProductRef(businessId, productId).collection('complementsgroups');
  getBusinessProductComplementGroupRef = (businessId: string, productId: string, groupId: string) =>
    this.getBusinessProductComplementsGroupsRef(businessId, productId).doc(groupId);
  getBusinessProductComplementsRef = (businessId: string, productId: string) =>
    this.getBusinessProductRef(businessId, productId).collection('complements');
  getBusinessProductComplementRef = (businessId: string, productId: string, complementId: string) =>
    this.getBusinessProductComplementsRef(businessId, productId).doc(complementId);
  getBusinessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
    this.getBusinessRef(businessId).collection('menu').doc(menuId);

  // business private subcollections and docs
  getBusinessPrivateRef = (id: string) => this.getBusinessesRef().doc(id).collection('private');
  getBusinessBankAccountRef = (id: string) => this.getBusinessPrivateRef(id).doc('bank');
  getBusinessPrivateStatisticsRef = (id: string) =>
    this.getBusinessPrivateRef(id).doc('statistics');

  // managers
  getManagersRef = () => this.firestore.collection('managers');
  getManagerRef = (managerId: string) => this.firestore.collection('managers').doc(managerId);

  // orders
  getOrdersRef = () => this.firestore.collection('orders');
  getOrderRef = (id: string) => this.getOrdersRef().doc(id);
  getOrderChatRef = (id: string) => this.getOrdersRef().doc(id).collection('chat');

  // consumers
  getConsumersRef = () => this.firestore.collection('consumers');
  getConsumerRef = (id: string) => this.getConsumersRef().doc(id);

  // couriers
  getCouriersRef = () => this.firestore.collection('couriers');
  getCourierRef = (id: string) => this.getCouriersRef().doc(id);

  // fleets
  getFleetsRef = () => this.firestore.collection('fleets');
  getFleetRef = (id: string) => this.getFleetsRef().doc(id);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');

  // storage
  // courier
  getCourierSelfieUploadPath = (courierId: string) => `couriers/${courierId}/selfie.jpg`;
  getCourierSelfieDownloadPath = (courierId: string) => `couriers/${courierId}/selfie_160x160.jpg`;
  getCourierDocumentUploadPath = (courierId: string) => `couriers/${courierId}/document.jpg`;
  getCourierDocumentDownloadPath = (courierId: string) =>
    `couriers/${courierId}/document_160x160.jpg`;
  // business
  getBusinessStoragePath = (businessId: string) => `businesses/${businessId}`;
  getBusinessLogoUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo.jpg`;
  getBusinessLogoStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo_160x160.jpg`;
  getBusinessCoverUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover.jpg`;
  getBusinessCoverStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover_160x160.jpg`;
  getProductsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/products`;
  getProductUploadStoragePath = (businessId: string, productId: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}.jpg`;
  getProductImageStoragePath = (businessId: string, productId: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}_160x160.jpg`;
  getComplementsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/complements`;
  getComplementImageStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_160x160.jpg`;
}
