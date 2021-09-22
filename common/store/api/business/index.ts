import {
  Business,
  Category,
  Complement,
  ComplementGroup,
  Ordering,
  Place,
  Product,
  WithId,
} from '@appjusto/types';
import { BusinessRecommendation } from '@appjusto/types/business';
import firebase from 'firebase';
import * as Sentry from 'sentry-expo';
import FilesApi from '../files';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';

export default class BusinessApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  async fetchBusiness(value: string) {
    const ref = this.refs.getBusinessesRef();
    let query: firebase.firestore.Query<firebase.firestore.DocumentData> | null = null;
    // check if it's code
    const r = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{7}$/.exec(value);
    if (!r) query = ref.where('slug', '==', value);
    else query = ref.where('code', '==', value);
    const snapshot = await query.get();
    if (snapshot.empty) return null;
    return documentAs<Business>(snapshot.docs[0]);
  }
  observeBusiness(businessId: string, resultHandler: (business: WithId<Business>) => void) {
    const ref = this.refs.getBusinessRef(businessId);
    const unsubscribe = ref.onSnapshot(
      (snapshot) => resultHandler(documentAs<Business>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    return unsubscribe;
  }
  // recommendations
  async addRecomendation(recommendedBusiness: Place, instagram?: string, phone?: string) {
    await this.refs.getRecommendationsRef().add({
      recommendedBusiness,
      instagram,
      phone,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
    } as BusinessRecommendation);
  }

  // menu
  observeCategories(businessId: string, resultHandler: (categories: WithId<Category>[]) => void) {
    const unsubscribe = this.refs
      .getBusinessCategoriesRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Category>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
    return unsubscribe;
  }
  observeProducts(businessId: string, resultHandler: (products: WithId<Product>[]) => void) {
    const unsubscribe = this.refs
      .getBusinessProductsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Product>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
    return unsubscribe;
  }
  observeProduct(
    businessId: string,
    productId: string,
    resultHandler: (products: WithId<Product>) => void
  ) {
    const unsubscribe = this.refs.getBusinessProductRef(businessId, productId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Product>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    return unsubscribe;
  }
  observeComplementsGroups(
    businessId: string,
    resultHandler: (products: WithId<ComplementGroup>[]) => void
  ) {
    const unsubscribe = this.refs
      .getBusinessComplementsGroupsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<ComplementGroup>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
    return unsubscribe;
  }
  observeComplements(businessId: string, resultHandler: (products: WithId<Complement>[]) => void) {
    const unsubscribe = this.refs
      .getBusinessComplementsRef(businessId)
      .where('enabled', '==', true)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Complement>(snapshot.docs)),
        (error) => {
          console.log(error);
          Sentry.Native.captureException(error);
        }
      );
    return unsubscribe;
  }
  observeMenuOrdering(
    businessId: string,
    resultHandler: (products: WithId<Ordering>) => void,
    menuId?: string
  ) {
    const unsubscribe = this.refs.getBusinessMenuOrderingRef(businessId, menuId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Ordering>(snapshot)),
      (error) => {
        console.log(error);
        Sentry.Native.captureException(error);
      }
    );
    return unsubscribe;
  }
  // storage
  fetchBusinessLogoURI(businessId: string) {
    return this.files.getDownloadURL(this.refs.getBusinessLogoStoragePath(businessId));
  }
  fetchBusinessCoverImageURI(businessId: string) {
    return this.files.getDownloadURL(this.refs.getBusinessCoverStoragePath(businessId));
  }
  fetchProductImageURI(businessId: string, productId: string, size: string = '288x288') {
    return this.files.getDownloadURL(
      this.refs.getProductImageStoragePath(businessId, productId, size)
    );
  }
  fetchProductComplementImageURI(businessId: string, complementId: string) {
    return this.files.getDownloadURL(
      this.refs.getComplementImageStoragePath(businessId, complementId)
    );
  }
}
