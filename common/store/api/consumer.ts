import firebase from 'firebase';
import { CancelToken } from 'axios';
import { CreatePaymentToken } from './types/payment/iugu';
import IuguApi from './payment/iugu';

export default class ConsumerApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions,
    private iugu: IuguApi
  ) {}

  async saveCard(data: CreatePaymentToken, cancelToken: CancelToken) {
    const paymentToken = await this.iugu.createPaymentToken(data, cancelToken);
    if (!paymentToken) return null;
    return (await this.functions.httpsCallable('savePaymentToken')({ paymentToken })).data;
  }
}
