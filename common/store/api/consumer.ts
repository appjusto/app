import { ConsumerProfile } from 'appjusto-types';
import { IuguCreatePaymentTokenData } from 'appjusto-types/payment/iugu';
import { CancelToken } from 'axios';
import firebase from 'firebase';

import IuguApi from './payment/iugu';

type SaveCardResult = {
  paymentMethodId: string;
};

export default class ConsumerApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions,
    private iugu: IuguApi
  ) {}

  async saveCard(
    cpf: string,
    data: IuguCreatePaymentTokenData,
    cancelToken?: CancelToken
  ): Promise<SaveCardResult> {
    console.log('createPaymentToken...');
    const paymentToken = await this.iugu.createPaymentToken(data, cancelToken);
    console.log(paymentToken);
    console.log('savePaymentToken...');
    const result = await this.functions.httpsCallable('savePaymentToken')({ paymentToken, cpf });
    console.log(result.data);
    return result.data;
  }

  async deletePaymentMethod(consumerId: string, paymentMethodId: string) {
    const consumerRef = this.firestore.collection('consumers').doc(consumerId);
    const consumer = (await consumerRef.get()).data() as ConsumerProfile;
    const methods = consumer.paymentChannel?.methods?.filter(
      (method) => method.id !== paymentMethodId
    );
    await consumerRef.update({ paymentChannel: { ...consumer.paymentChannel, methods } } as Partial<
      ConsumerProfile
    >);
  }
}
