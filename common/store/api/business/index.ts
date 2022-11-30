import {
  Business,
  BusinessMenuMessage,
  BusinessRecommendation,
  Category,
  Complement,
  ComplementGroup,
  Ordering,
  OrderStatus,
  Place,
  Product,
  WithId,
} from '@appjusto/types';
import {
  addDoc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import { Flavor } from '../../../../../types';
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
    const snapshot = await getDoc(this.firestoreRefs.getBusinessRef(businessId));
    if (!snapshot.exists()) return null;
    return documentAs<Business>(snapshot);
  }

  async fetchBusiness(value: string) {
    const r = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/.exec(value);
    const fieldPath = !r ? 'slug' : 'code';
    const snapshot = await getDocs(
      query(this.firestoreRefs.getBusinessesRef(), where(fieldPath, '==', value), limit(1))
    );
    if (snapshot.empty) return null;
    return documentAs<Business>(snapshot.docs[0]);
  }

  async fetchConsumerTotalOrdersInBusiness(
    businessId: string,
    consumerId: string,
    statuses: OrderStatus[]
  ) {
    const snapshot = await getDocs(
      query(
        this.firestoreRefs.getOrdersRef(),
        orderBy('createdOn', 'desc'),
        where('business.id', '==', businessId),
        where('consumer.id', '==', consumerId),
        where('status', 'in', statuses)
      )
    );
    return snapshot.size;
  }

  observeBusiness(businessId: string, resultHandler: (business: WithId<Business>) => void) {
    return onSnapshot(
      this.firestoreRefs.getBusinessRef(businessId),
      (snapshot) => resultHandler(documentAs<Business>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  // manager
  async fetchBusinessesManagedBy(email: string) {
    const snapshot = await getDocs(
      query(
        this.firestoreRefs.getBusinessesRef(),
        where('managers', 'array-contains', email),
        orderBy('createdOn', 'desc')
        // limit(1)
      )
    );
    if (snapshot.empty) return [];
    return documentsAs<Business>(snapshot.docs);
  }

  async updateBusiness(businessId: string, changes: Partial<Business>) {
    await updateDoc(this.firestoreRefs.getBusinessRef(businessId), changes);
  }

  async sendKeepAlive(businessId: string) {
    await this.updateBusiness(businessId, { keepAlive: serverTimestamp() });
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
    await addDoc(this.firestoreRefs.getRecommendationsRef(), {
      recommendedBusiness,
      flavor,
      userId: userId ?? null,
      instagram: instagram ?? null,
      phone: phone ?? null,
      owner: owner ?? null,
      createdOn: serverTimestamp(),
    } as BusinessRecommendation);
  }

  // menu
  observeCategories(businessId: string, resultHandler: (categories: WithId<Category>[]) => void) {
    return onSnapshot(
      query(this.firestoreRefs.getBusinessCategoriesRef(businessId), where('enabled', '==', true)),
      (snapshot) => resultHandler(documentsAs<Category>(snapshot.docs)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  observeProducts(businessId: string, resultHandler: (products: WithId<Product>[]) => void) {
    return onSnapshot(
      query(this.firestoreRefs.getBusinessProductsRef(businessId), where('enabled', '==', true)),
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
    return onSnapshot(
      this.firestoreRefs.getBusinessProductRef(businessId, productId),
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
    return onSnapshot(
      query(
        this.firestoreRefs.getBusinessComplementsGroupsRef(businessId),
        where('enabled', '==', true)
      ),
      (snapshot) => resultHandler(documentsAs<ComplementGroup>(snapshot.docs)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  observeComplements(businessId: string, resultHandler: (products: WithId<Complement>[]) => void) {
    return onSnapshot(
      query(this.firestoreRefs.getBusinessComplementsRef(businessId), where('enabled', '==', true)),
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
    return onSnapshot(
      this.firestoreRefs.getBusinessMenuOrderingRef(businessId, menuId),
      (snapshot) => resultHandler(documentAs<Ordering>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  async fetchBusinessMenuMessage(businessId: string) {
    const snapshot = await getDoc(this.firestoreRefs.getBusinessMenuMessageRef(businessId));
    if (!snapshot.exists()) return null;
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
