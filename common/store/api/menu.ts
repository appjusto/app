import {
  Business,
  Category,
  MenuConfig,
  Product,
  WithId,
  ProductsByCategory,
} from 'appjusto-types';
import firebase from 'firebase/app';

import FilesApi from './files';
import { documentAs, singleDocumentAs } from './types';

export default class MenuApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    // private functions: firebase.functions.Functions,
    private files: FilesApi
  ) {}

  // private
  // helpers
  private getRestaurantRef(restaurantId: string) {
    return this.firestore.collection('businesses').doc(restaurantId);
  }
  private getCategoriesRef(restaurantId: string) {
    return this.getRestaurantRef(restaurantId).collection('categories');
  }
  private getMenuConfigRef(restaurantId: string) {
    return this.getRestaurantRef(restaurantId).collection('config').doc('menu');
  }
  private getProductsRef(restaurantId: string) {
    return this.getRestaurantRef(restaurantId).collection('products');
  }
  private getProductRef(restaurantId: string, productId: string) {
    return this.getProductsRef(restaurantId).doc(productId);
  }

  // firestore
  // restaurants
  async getRestaurant(restaurantId: string) {
    const query = this.firestore.collection('businesses').doc(restaurantId);
    const doc = await query.get();
    return singleDocumentAs<Business>(doc);
  }

  async getOpenRestaurants() {
    const query = this.firestore.collection('businesses').where('status', '==', 'open');
    const docs = (await query.get()).docs;
    return documentAs<Business>(docs);
  }

  async getClosedRestaurants() {
    const query = this.firestore.collection('businesses').where('status', '==', 'closed');
    const docs = (await query.get()).docs;
    return documentAs<Business>(docs);
  }

  // categories
  async getCategories(restaurantId: string) {
    const query = this.getCategoriesRef(restaurantId);
    const docs = (await query.get()).docs;
    return documentAs<Category>(docs);
  }

  getOrderedCategories = (categories: WithId<Category>[], order: string[]): WithId<Category>[] => {
    return categories.sort((a, b) =>
      order.indexOf(a.id) === -1
        ? 1 // new categories go to the end by the default
        : order.indexOf(a.id) - order.indexOf(b.id)
    );
  };

  observeCategories(
    restaurantId: string,
    resultHandler: (categories: WithId<Category>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getCategoriesRef(restaurantId).onSnapshot(
      (querySnapshot) => {
        resultHandler(documentAs<Category>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  // menu config
  async getRestaurantMenuConfig(restaurantId: string) {
    const query = this.getMenuConfigRef(restaurantId);
    const doc = await query.get();
    return singleDocumentAs<MenuConfig>(doc);
  }

  observeMenuConfig(
    restaurantId: string,
    resultHandler: (menuConfig: MenuConfig) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.getMenuConfigRef(restaurantId).onSnapshot(
      (doc) => {
        resultHandler({ ...(doc.data() as MenuConfig) });
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  async updateMenuConfig(restaurantId: string, menuConfig: MenuConfig) {
    await this.getMenuConfigRef(restaurantId).set(menuConfig, { merge: true });
  }

  //products
  async getProducts(restaurantId: string) {
    const query = this.getProductsRef(restaurantId);
    const docs = (await query.get()).docs;
    return documentAs<Product>(docs);
  }

  observeProducts(
    restaurantId: string,
    resultHandler: (products: WithId<Product>[]) => void
  ): firebase.Unsubscribe {
    const query = this.getProductsRef(restaurantId);
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        resultHandler(documentAs<Product>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }

  getProductsByCategoryId = (
    products: WithId<Product>[],
    categoryId: string,
    productsOrderByCategoryId: ProductsByCategory
  ) => {
    const productsOrder = productsOrderByCategoryId[categoryId];
    if (!productsOrder) return [];
    return products
      .filter((product) => productsOrder.indexOf(product.id) !== -1) // only in this category
      .sort((a, b) => productsOrder.indexOf(a.id) - productsOrder.indexOf(b.id));
  };
}
