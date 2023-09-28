import * as Application from 'expo-application';
import { serverTimestamp } from 'firebase/firestore';
import queryString from 'query-string';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../common/app/context';
import { getConsumer } from '../../../../common/store/consumer/selectors';

// https://play.google.com/store/apps/details?id=br.com.appjusto.consumer.live&referrer=utm_source%3Dentregador%26utm_medium%3Dflyer%26utm_campaign%3DFlyer%2520do%2520entregador
export const useInstallReferrer = () => {
  // redux
  const api = useContext(ApiContext);
  const consumer = useSelector(getConsumer);
  const consumerId = consumer?.id;
  const installReferrer = consumer?.installReferrer;
  // side effects
  useEffect(() => {
    if (!consumerId) return;
    if (installReferrer === undefined) {
      Application.getInstallReferrerAsync()
        .then((value) => {
          try {
            const utm = queryString.parse(value);
            api
              .profile()
              .updateProfile(consumerId, {
                installReferrer: utm ?? null,
                updatedOn: serverTimestamp(),
              })
              .then(null);
          } catch (error) {
            console.error(error);
          }
        })
        .catch(() => {});
    }
  }, [consumerId, installReferrer, api]);
};
