import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const collection = (
  doc: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  collectionPath: string
) => doc.collection(collectionPath);
const doc = (
  collection: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>,
  path: string
) => collection.doc(path);
export class FirestoreRefs {
  getProfileCollection = (flavor: string) => {
    let collection: string | null = null;
    if (flavor === 'consumer') collection = 'consumers';
    if (flavor === 'courier') collection = 'couriers';
    if (flavor === 'business') collection = 'managers';
    if (!collection) throw new Error('getProfileCollection(): getFlavor() inválido.');
    return firestore().collection(collection);
  };

  // recommendations
  getRecommendationsRef = () => firestore().collection('recommendations');

  // withdraws
  getWithdrawsRef = () => firestore().collection('withdraws');

  // reviews
  getReviewsRef = () => firestore().collection('reviews');
  getReviewRef = (id: string) => doc(firestore().collection('reviews'), id);

  // platform
  getPlatformRef = () => firestore().collection('platform');

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
  getBusinessesRef = () => firestore().collection('businesses');
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
  getManagersRef = () => firestore().collection('managers');
  getManagerRef = (managerId: string) => doc(this.getManagersRef(), managerId);

  // orders
  getOrdersRef = () => firestore().collection('orders');
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
  getInvoicesRef = () => firestore().collection('invoices');
  getInvoiceRef = (id: string) => doc(this.getInvoicesRef(), id);
  getInvoiceLogsRef = (id: string) => collection(this.getInvoiceRef(id), 'changes');

  // chats
  getChatsRef = () => firestore().collection('chats');
  getChatMessageRef = (messageId: string) => doc(this.getChatsRef(), messageId);

  // consumers
  getConsumersRef = () => firestore().collection('consumers');
  getConsumerRef = (id: string) => doc(this.getConsumersRef(), id);

  // users
  getUsersRef = () => firestore().collection('users');
  getUsersSubcollectionsRef = () => doc(this.getUsersRef(), 'subcollections');
  getUsersChangesRef = () => collection(this.getUsersSubcollectionsRef(), 'changes');

  // couriers
  getCouriersRef = () => firestore().collection('couriers');
  getCourierRef = (id: string) => doc(this.getCouriersRef(), id);
  getCourierReviewsRef = (id: string) => collection(this.getCourierRef(id), 'reviews');

  // courier requests
  getCourierRequestsRef = () => firestore().collection('courier-requests');

  // ledger
  getLedgerRef = () => firestore().collection('ledger');
  getLedgerDocRef = (id: string) => doc(this.getLedgerRef(), id);

  // fleets
  getFleetsRef = () => firestore().collection('fleets');
  getFleetRef = (id: string) => doc(this.getFleetsRef(), id);
  getAppJustoFleetRef = () => this.getFleetRef('appjusto');
}
