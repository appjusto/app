import {
  Business,
  BusinessStatus,
  BusinessType,
  Category,
  MenuConfig,
  Product,
  WithId,
} from 'appjusto-types';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';

export default class BusinessApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  // business
  async fetchBusinesses(status: BusinessStatus, type: BusinessType = 'restaurant') {
    const query = this.refs
      .getBusinessesRef()
      .where('type', '==', type)
      .where('status', '==', status);
    const docs = (await query.get()).docs;
    return documentsAs<Business>(docs);
  }

  observeBusiness(businessId: string, resultHandler: (business: WithId<Business>) => void) {
    const unsubscribe = this.refs.getBusinessRef(businessId).onSnapshot(
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

  observeMenuConfig(businessId: string, resultHandler: (products: WithId<MenuConfig>) => void) {
    const unsubscribe = this.refs.getBusinessMenuConfigRef(businessId).onSnapshot(
      (snapshot) => resultHandler(documentAs<MenuConfig>(snapshot)),
      (error) => console.error(error)
    );
    return unsubscribe;
  }
}
