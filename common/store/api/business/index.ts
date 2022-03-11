import { FirestoreRefs, StoragePaths } from '@appjusto/firebase-refs';
import {
  Business,
  BusinessMenuMessage,
  BusinessRecommendation,
  Category,
  Complement,
  ComplementGroup,
  Ordering,
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
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import FilesApi from '../files';
import { documentAs, documentsAs } from '../types';

export default class BusinessApi {
  constructor(
    private firestoreRefs: FirestoreRefs,
    private storagePaths: StoragePaths,
    private files: FilesApi
  ) {}

  // firestore
  async fetchBusiness(value: string) {
    const r = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/.exec(value);
    const fieldPath = !r ? 'slug' : 'code';
    const snapshot = await getDocs(
      query(this.firestoreRefs.getBusinessesRef(), where(fieldPath, '==', value), limit(1))
    );
    if (snapshot.empty) return null;
    return documentAs<Business>(snapshot.docs[0]);
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
  // recommendations
  async addRecomendation(
    recommendedBusiness: Place,
    consumerId?: string,
    instagram?: string,
    phone?: string,
    owner?: string
  ) {
    await addDoc(this.firestoreRefs.getRecommendationsRef(), {
      recommendedBusiness,
      consumerId: consumerId ?? null,
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
