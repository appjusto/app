import { Business, Category, MenuConfig, Product, WithId } from 'appjusto-types';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';
import { ObserveBusinessOptions } from './types';

export default class BusinessApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  // business
  observeBusinesses(
    options: ObserveBusinessOptions,
    resultHandler: (businesses: WithId<Business>[]) => void
  ) {
    const { type = 'restaurant', status, search } = options;
    let query = this.refs.getBusinessesRef().where('type', '==', type);
    if (status) query = query.where('status', '==', status);
    if (search) {
      query = query
        .where('name', '>=', search)
        .where('name', '<=', `${search}\uf8ff`)
        .orderBy('name', 'asc');
    }
    const unsubscribe = query.onSnapshot(
      (snapshot) => resultHandler(documentsAs<Business>(snapshot.docs)),
      (error) => console.error(error)
    );
    return unsubscribe;
  }

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

  observeMenuConfig(businessId: string, resultHandler: (products: WithId<MenuConfig>) => void) {
    const unsubscribe = this.refs.getBusinessMenuConfigRef(businessId).onSnapshot(
      (snapshot) => resultHandler(documentAs<MenuConfig>(snapshot)),
      (error) => console.error(error)
    );
    return unsubscribe;
  }
}
