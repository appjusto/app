import {
  Business,
  Category,
  CategoryWithProducts,
  MenuConfig,
  Product,
  ProductsByCategory,
  WithId,
} from 'appjusto-types';
import FirebaseRefs from './FirebaseRefs';
import { documentAs, documentsAs } from './types';

export default class MenuApi {
  constructor(private refs: FirebaseRefs) {}

  // firestore
  // business
  async getOpenRestaurants() {
    const query = this.refs
      .getBusinessesRef()
      .where('type', '==', 'restaurant')
      .where('status', '==', 'open');
    const docs = (await query.get()).docs;
    return documentsAs<Business>(docs);
  }

  async getClosedRestaurants() {
    const query = this.refs
      .getBusinessesRef()
      .where('type', '==', 'restaurant')
      .where('status', '==', 'closed');
    const docs = (await query.get()).docs;
    return documentsAs<Business>(docs);
  }

  async fetchRestaurant(restaurantId: string) {
    return documentAs<Business>(await this.refs.getBusinessRef(restaurantId).get());
  }

  // menu
  async fetchRestaurantMenu(restaurantId: string) {
    const categories = documentsAs<WithId<Category>>(
      (await this.refs.getBusinessCategoriesRef(restaurantId).get()).docs
    );
    const products = documentsAs<WithId<Product>>(
      (await this.refs.getBusinessProductsRef(restaurantId).get()).docs
    );
    const menuConfig = documentAs<MenuConfig>(
      await this.refs.getBusinessMenuConfigRef(restaurantId).get()
    );
    return this.getOrderedMenu(categories, products, menuConfig);
  }

  observeCategories(
    restaurantId: string,
    resultHandler: (categories: WithId<Category>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessCategoriesRef(restaurantId).onSnapshot(
      (snapshot) => {
        resultHandler(documentsAs<Category>(snapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeProducts(
    restaurantId: string,
    resultHandler: (products: WithId<Product>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessProductsRef(restaurantId).onSnapshot(
      (snapshot) => {
        resultHandler(documentsAs<Product>(snapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  observeMenuConfig(
    restaurantId: string,
    resultHandler: (products: WithId<MenuConfig>) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.refs.getBusinessMenuConfigRef(restaurantId).onSnapshot(
      (snapshot) => {
        resultHandler(documentAs<MenuConfig>(snapshot));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  getOrderedMenu(categories: WithId<Category>[], products: WithId<Product>[], config: MenuConfig) {
    if (categories.length === 0) return [];
    const { categoriesOrder, productsOrderByCategoryId } = config;
    return this.getOrderedCategories(categories, categoriesOrder).map((category) => {
      return {
        ...category,
        products: this.getProductsByCategoryId(products, category.id, productsOrderByCategoryId),
      } as CategoryWithProducts;
    });
  }

  private getOrderedCategories(
    categories: WithId<Category>[],
    order: string[]
  ): WithId<Category>[] {
    return categories.sort((a, b) =>
      order.indexOf(a.id) === -1
        ? 1 // new categories go to the end by the default
        : order.indexOf(a.id) - order.indexOf(b.id)
    );
  }

  private getProductsByCategoryId(
    products: WithId<Product>[],
    categoryId: string,
    productsOrderByCategoryId: ProductsByCategory
  ) {
    const productsOrder = productsOrderByCategoryId[categoryId];
    if (!productsOrder) return [];
    return products
      .filter((product) => productsOrder.indexOf(product.id) !== -1) // only in this category
      .sort((a, b) => productsOrder.indexOf(a.id) - productsOrder.indexOf(b.id));
  }
}
