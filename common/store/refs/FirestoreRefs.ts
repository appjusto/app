import { collection, doc, getFirestore } from 'firebase/firestore';

export class FirestoreRefs {
  // recommendations
  getRecommendationsRef = () => collection(getFirestore(), 'recommendations');

  // withdraws
  getWithdrawsRef = () => collection(getFirestore(), 'withdraws');

  // reviews
  getReviewsRef = () => collection(getFirestore(), 'reviews');
  getReviewRef = (id: string) => doc(collection(getFirestore(), 'reviews'), id);

  // platform
  getPlatformRef = () => collection(getFirestore(), 'platform');

  // platform docs
  getPlatformParamsRef = () => doc(this.getPlatformRef(), 'params');
  getPlatformStatisticsRef = () => doc(this.getPlatformRef(), 'statistics');
  getPlatformCitiesStatisticsRef = () => collection(this.getPlatformStatisticsRef(), 'cities');
  getPlatformCityStatisticsRef = (name: string) => doc(this.getPlatformCitiesStatisticsRef(), name);
  getPlatformDatasRef = () => doc(this.getPlatformRef(), 'data');
  getPlatformLogsRef = () => doc(this.getPlatformRef(), 'logs');
  getPlatformAccessRef = () => doc(this.getPlatformRef(), 'access');
  getPlatformFeesRef = () => doc(this.getPlatformRef(), 'fees');

  // platform data subcollections
  getBanksRef = () => collection(this.getPlatformDatasRef(), 'banks');
  getIssuesRef = () => collection(this.getPlatformDatasRef(), 'issues');
  getCuisinesRef = () => collection(this.getPlatformDatasRef(), 'cuisines');
  getClassificationsRef = () => collection(this.getPlatformDatasRef(), 'classifications');
  getReviewTagsRef = () => collection(this.getPlatformDatasRef(), 'reviewTags');

  // platform logs subcollections
  getPlatformLoginLogsRef = () => collection(this.getPlatformLogsRef(), 'logins');

  // businesses
  getBusinessesRef = () => collection(getFirestore(), 'businesses');
  getBusinessRef = (id: string) => doc(this.getBusinessesRef(), id);

  // business menu
  getBusinessMenuMessageRef = (businessId: string) =>
    doc(collection(this.getBusinessRef(businessId), 'menu'), 'message');
  getBusinessCategoriesRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'categories');
  getBusinessCategoryRef = (businessId: string, categoryId: string) =>
    doc(this.getBusinessCategoriesRef(businessId), categoryId);
  getBusinessProductsRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'products');
  getBusinessProductRef = (businessId: string, id: string) =>
    doc(this.getBusinessProductsRef(businessId), id);
  getBusinessComplementsGroupsRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'complementsgroups');
  getBusinessComplementGroupRef = (businessId: string, groupId: string) =>
    doc(this.getBusinessComplementsGroupsRef(businessId), groupId);
  getBusinessComplementsRef = (businessId: string) =>
    collection(this.getBusinessRef(businessId), 'complements');
  getBusinessComplementRef = (businessId: string, complementId: string) =>
    doc(this.getBusinessComplementsRef(businessId), complementId);
  getBusinessMenuOrderingRef = (businessId: string, menuId: string = 'default') =>
    doc(collection(this.getBusinessRef(businessId), 'menu'), menuId);

  // managers
  getManagersRef = () => collection(getFirestore(), 'managers');
  getManagerRef = (managerId: string) => doc(collection(getFirestore(), 'managers'), managerId);

  // orders
  getOrdersRef = () => collection(getFirestore(), 'orders');
  getOrderRef = (id: string) => doc(this.getOrdersRef(), id);
  getOrderChatRef = (id: string) => collection(doc(this.getOrdersRef(), id), 'chat');
  getOrderChatMessageRef = (orderId: string, id: string) => doc(this.getOrderChatRef(orderId), id);
  getOrderIssuesRef = (id: string) => collection(doc(this.getOrdersRef(), id), 'issues');
  getOrderPrivateRef = (id: string) => collection(doc(this.getOrdersRef(), id), 'private');
  getOrderCancellationRef = (orderId: string) =>
    doc(this.getOrderPrivateRef(orderId), 'cancellation');
  getOrderConfirmationRef = (id: string) => doc(this.getOrderPrivateRef(id), 'confirmation');
  getOrderLogsRef = (id: string) => collection(this.getOrderRef(id), 'logs');

  // invoices
  /** @deprecated */
  getInvoicesRef = () => collection(getFirestore(), 'invoices');
  /** @deprecated */
  getInvoiceRef = (id: string) => doc(this.getInvoicesRef(), id);

  // payments
  getPaymentsRef = () => collection(getFirestore(), 'payments');
  getPaymentRef = (id: string) => doc(this.getPaymentsRef(), id);

  // cards
  getCardsRef = () => collection(getFirestore(), 'cards');

  // chats
  getChatsRef = () => collection(getFirestore(), 'chats');
  getChatMessageRef = (messageId: string) => doc(this.getChatsRef(), messageId);

  // consumers
  getConsumersRef = () => collection(getFirestore(), 'consumers');
  getConsumerRef = (id: string) => doc(this.getConsumersRef(), id);

  // users
  getUsersRef = () => collection(getFirestore(), 'users');
  getUsersSubcollectionsRef = () => doc(this.getUsersRef(), 'subcollections');
  getUsersChangesRef = () => collection(this.getUsersSubcollectionsRef(), 'changes');

  // couriers
  getCouriersRef = () => collection(getFirestore(), 'couriers');
  getCourierRef = (id: string) => doc(this.getCouriersRef(), id);
  getCourierReviewsRef = (id: string) => collection(this.getCourierRef(id), 'reviews');

  // courier requests
  getCourierRequestsRef = () => collection(getFirestore(), 'courier-requests');

  // fleets
  getFleetsRef = () => collection(getFirestore(), 'fleets');
  getFleetRef = (id: string) => doc(this.getFleetsRef(), id);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');
}
