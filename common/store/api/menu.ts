import { Business, Category, MenuConfig, Product } from 'appjusto-types';
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
    return this.firestore.collection('business').doc(restaurantId);
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
    const query = this.firestore.collection('business').doc(restaurantId);
    const doc = await query.get();
    return singleDocumentAs<Business>(doc);
  }

  async getOpenRestaurants() {
    const query = this.firestore
      .collection('business')
      .where('type', '==', 'restaurant')
      .where('status', '==', 'open');
    const docs = (await query.get()).docs;
    return documentAs<Business>(docs);
  }

  async getClosedRestaurants() {
    const query = this.firestore
      .collection('business')
      .where('type', '==', 'restaurant')
      .where('status', '==', 'closed');
    const docs = (await query.get()).docs;
    return documentAs<Business>(docs);
  }

  // categories
  async getCategories(restaurantId: string) {
    const query = this.getCategoriesRef(restaurantId);
    const docs = (await query.get()).docs;
    return documentAs<Category>(docs);
  }

  // menu config
  async getRestaurantMenuConfig(restaurantId: string) {
    const query = this.getMenuConfigRef(restaurantId);
    const doc = await query.get();
    return singleDocumentAs<MenuConfig>(doc);
  }

  //products
  async getProducts(restaurantId: string) {
    const query = this.getProductsRef(restaurantId);
    const docs = (await query.get()).docs;
    return documentAs<Product>(docs);
  }
}
