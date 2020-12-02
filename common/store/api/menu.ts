import { Business, Product } from 'appjusto-types';
import firebase from 'firebase/app';

import FilesApi from './files';
import { documentAs, singleDocumentAs } from './types';

export default class MenuApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    // private functions: firebase.functions.Functions,
    private files: FilesApi
  ) {}

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
    const query = this.firestore.collection('business').doc(restaurantId).collection('categories');
    const docs = (await query.get()).docs;
    return documentAs<Business>(docs);
  }
  async getCategory(restaurantId: string, categoryId: string) {
    const query = this.firestore
      .collection('business')
      .doc(restaurantId)
      .collection('categories')
      .doc(categoryId);
    const doc = await query.get();
    return singleDocumentAs<Business>(doc);
  }

  //products
}
