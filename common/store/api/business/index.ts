import {
  Business,
  BusinessMenuMessage,
  BusinessRecommendation,
  Category,
  Complement,
  ComplementGroup,
  Flavor,
  Ordering,
  OrderStatus,
  Place,
  Product,
  WithId,
} from '@appjusto/types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import * as Sentry from 'sentry-expo';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { StoragePaths } from '../../refs/StoragePaths';
import FilesApi from '../files';
import { documentAs, documentsAs } from '../types';

export default class BusinessApi {
  constructor(
    private firestoreRefs: FirestoreRefs,
    private storagePaths: StoragePaths,
    private files: FilesApi
  ) {}

  // firestore
  async fetchBusinessById(businessId: string) {
    const snapshot = await this.firestoreRefs.getBusinessRef(businessId).get();
    if (!snapshot.exists) return null;
    return documentAs<Business>(snapshot);
  }

  async fetchBusiness(value: string) {
    const r = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/.exec(value);
    const fieldPath = !r ? 'slug' : 'code';
    const snapshot = await this.firestoreRefs
      .getBusinessesRef()
      .where(fieldPath, '==', value)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return documentAs<Business>(snapshot.docs[0]);
  }

  async fetchConsumerTotalOrdersInBusiness(
    businessId: string,
    consumerId: string,
    statuses: OrderStatus[]
  ) {
    const snapshot = await this.firestoreRefs
      .getOrdersRef()
      .orderBy('createdOn', 'desc')
      .where('business.id', '==', businessId)
      .where('consumer.id', '==', consumerId)
      .where('status', 'in', statuses)
      .get();
    return snapshot.size;
  }

  observeBusiness(businessId: string, resultHandler: (business: WithId<Business>) => void) {
    return this.firestoreRefs.getBusinessRef(businessId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Business>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }
  // manager
  async fetchBusinessesManagedBy(email: string) {
    try {
      const snapshot = await this.firestoreRefs
        .getBusinessesRef()
        .where('situation', '==', 'approved')
        .where('managers', 'array-contains', email)
        .get();
      if (snapshot.empty) return [];
      return documentsAs<Business>(snapshot.docs);
    } catch (error: unknown) {
      console.log('ERROR');
      console.log(JSON.stringify(error));
      Sentry.Native.captureException(error);
    }
  }

  async updateBusiness(businessId: string, changes: Partial<Business>) {
    await this.firestoreRefs.getBusinessRef(businessId).update(changes);
  }

  async sendKeepAlive(businessId: string) {
    await this.updateBusiness(businessId, {
      keepAlive:
        FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
    });
  }

  // recommendations
  async addRecomendation(
    recommendedBusiness: Place,
    flavor: Flavor,
    userId?: string,
    instagram?: string,
    phone?: string,
    owner?: string
  ) {
    await this.firestoreRefs.getRecommendationsRef().add({
      recommendedBusiness,
      flavor,
      userId: userId ?? null,
      instagram: instagram ?? null,
      phone: phone ?? null,
      owner: owner ?? null,
      createdOn:
        FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
    } as BusinessRecommendation);
  }

  // menu
  observeCategories(businessId: string, resultHandler: (categories: WithId<Category>[]) => void) {
    return this.firestoreRefs
      .getBusinessCategoriesRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Category>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
  }

  observeProducts(businessId: string, resultHandler: (products: WithId<Product>[]) => void) {
    return this.firestoreRefs
      .getBusinessProductsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Product>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
  }

  observeProduct(
    businessId: string,
    productId: string,
    resultHandler: (products: WithId<Product>) => void
  ) {
    return this.firestoreRefs.getBusinessProductRef(businessId, productId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Product>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  observeComplementsGroups(
    businessId: string,
    resultHandler: (products: WithId<ComplementGroup>[]) => void
  ) {
    return this.firestoreRefs
      .getBusinessComplementsGroupsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<ComplementGroup>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
  }

  observeComplements(businessId: string, resultHandler: (products: WithId<Complement>[]) => void) {
    return this.firestoreRefs
      .getBusinessComplementsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Complement>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
  }

  observeMenuOrdering(
    businessId: string,
    resultHandler: (products: WithId<Ordering>) => void,
    menuId?: string
  ) {
    return this.firestoreRefs.getBusinessMenuOrderingRef(businessId, menuId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Ordering>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  async fetchBusinessMenuMessage(businessId: string) {
    const snapshot = await this.firestoreRefs.getBusinessMenuMessageRef(businessId).get();
    if (!snapshot.exists) return null;
    return snapshot.data() as BusinessMenuMessage;
  }
  // storage
  fetchBusinessLogoURI(businessId: string) {
    return this.files.getDownloadURL(this.storagePaths.getBusinessLogoStoragePath(businessId));
  }
  fetchBusinessCoverImageURI(businessId: string) {
    return this.files.getDownloadURL(this.storagePaths.getBusinessCoverStoragePath(businessId));
  }
  fetchProductImageURI(businessId: string, productId: string, size: string = '288x288') {
    return this.files.getDownloadURL(
      this.storagePaths.getProductImageStoragePath(businessId, productId, size)
    );
  }
  fetchProductComplementImageURI(businessId: string, complementId: string) {
    return this.files.getDownloadURL(
      this.storagePaths.getComplementImageStoragePath(businessId, complementId)
    );
  }
}
