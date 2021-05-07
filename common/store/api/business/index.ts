import {
  Business,
  Category,
  Complement,
  ComplementGroup,
  Ordering,
  Product,
  WithId,
} from '@appjusto/types';
import FilesApi from '../files';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';

export default class BusinessApi {
  constructor(private refs: FirebaseRefs, private files: FilesApi) {}

  // firestore
  observeBusiness(businessId: string, resultHandler: (business: WithId<Business>) => void) {
    const ref = this.refs.getBusinessRef(businessId);
    const unsubscribe = ref.onSnapshot(
      (snapshot) => resultHandler(documentAs<Business>(snapshot)),
      (error) => console.error(error)
    );
    return unsubscribe;
  }
  // menu
  observeCategories(businessId: string, resultHandler: (categories: WithId<Category>[]) => void) {
    const unsubscribe = this.refs.getBusinessCategoriesRef(businessId).onSnapshot(
      (snapshot) => resultHandler(documentsAs<Category>(snapshot.docs)),
      (error) => console.error(error)
    );
    return unsubscribe;
  }
  observeProducts(businessId: string, resultHandler: (products: WithId<Product>[]) => void) {
    const unsubscribe = this.refs.getBusinessProductsRef(businessId).onSnapshot(
      (snapshot) => resultHandler(documentsAs<Product>(snapshot.docs)),
      (error) => console.error(error)
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
      (error) => console.error(error)
    );
    return unsubscribe;
  }
  observeProductComplementsGroups(
    businessId: string,
    productId: string,
    resultHandler: (products: WithId<ComplementGroup>[]) => void
  ) {
    const unsubscribe = this.refs
      .getBusinessProductComplementsGroupsRef(businessId, productId)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<ComplementGroup>(snapshot.docs)),
        (error) => console.error(error)
      );
    return unsubscribe;
  }
  observeProductComplements(
    businessId: string,
    productId: string,
    resultHandler: (products: WithId<Complement>[]) => void
  ) {
    const unsubscribe = this.refs
      .getBusinessProductComplementsRef(businessId, productId)
      .onSnapshot(
        (snapshot) => resultHandler(documentsAs<Complement>(snapshot.docs)),
        (error) => console.error(error)
      );
    return unsubscribe;
  }
  observeMenuOrdering(businessId: string, resultHandler: (products: WithId<Ordering>) => void) {
    const unsubscribe = this.refs.getBusinessMenuOrderingRef(businessId).onSnapshot(
      (snapshot) => resultHandler(documentAs<Ordering>(snapshot)),
      (error) => console.error(error)
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
