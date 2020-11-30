import { Product } from 'appjusto-types';
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
  private getBusinessRef(businessId: string) {
    return this.firestore.collection('business').doc(businessId);
  }
  private getCategoriesRef(businessId: string) {
    return this.getBusinessRef(businessId).collection('categories');
  }
  private getProductsRef(businessId: string) {
    return this.getBusinessRef(businessId).collection('products');
  }
  private getProductRef(businessId: string, productId: string) {
    return this.getProductsRef(businessId).doc(productId);
  }
  private getMenuConfigRef(businessId: string) {
    return this.getBusinessRef(businessId).collection('config').doc('menu');
  }
  private getStoragePath(businessId: string) {
    return `business/${businessId}/menu/default/products`;
  }

  // public
  // firestore

  // categories

  // products

  // createProductRef(businessId: string): string {
  //   return this.getProductsRef(businessId).doc().id;
  // }

  async fetchProduct(businessId: string, productId: string) {
    const doc = await this.getProductRef(businessId, productId).get();
    return singleDocumentAs<Product>(doc);
  }

  getProductURL(businessId: string, productId: string) {
    return this.files.getDownloadURL(
      `${this.getStoragePath(businessId)}/${productId}_1024x1024.jpg`
    );
  }
}
