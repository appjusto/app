import { CreatePaymentToken, CreatePaymentTokenData, PaymentToken } from 'appjusto-types/payment';
import {
  adaptCreatePaymentTokenToIugu,
  adaptPaymentTokenFromIugu,
  IuguPaymentToken,
} from 'appjusto-types/payment/iugu';
import axios, { CancelToken } from 'axios';

const API_ENDPOINT = 'https://api.iugu.com/v1';

export default class IuguApi {
  constructor(private accountId: string) {}

  async createPaymentToken(
    data: CreatePaymentTokenData,
    cancelToken: CancelToken
  ): Promise<PaymentToken | null> {
    // TODO: location & radius?
    const url = `${API_ENDPOINT}/payment_token`;
    const payload = adaptCreatePaymentTokenToIugu({
      accountId: this.accountId,
      method: 'credit_card',
      test: true, // TODO: remove
      data,
    } as CreatePaymentToken);
    try {
      const response = await axios.post(url, payload, { cancelToken });
      const token = adaptPaymentTokenFromIugu(response.data as IuguPaymentToken);
      console.log(token);
      return token;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled!');
        return null;
      }
      console.error(err);
      return err;
    }
  }
}
