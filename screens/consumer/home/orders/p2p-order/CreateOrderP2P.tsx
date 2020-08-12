import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { motocycle } from '../../../../../assets/icons';
import { getConsumer } from '../../../../../store/consumer/selectors';
import { createOrder, confirmOrder } from '../../../../../store/order/actions';
import OrderImpl from '../../../../../store/order/types/OrderImpl';
import PlaceImpl from '../../../../../store/order/types/PlaceImpl';
import { showToast } from '../../../../../store/ui/actions';
import { t } from '../../../../../strings';
import { ApiContext, AppDispatch } from '../../../../app/context';
import ShowIf from '../../../../common/ShowIf';
import { screens, borders, texts } from '../../../../common/styles';
import { HomeStackParamList } from '../../types';
import OrderMap from './OrderMap';
import OrderPager from './OrderPager';

type ScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CreateOrderP2P'>;
type ScreenRouteProp = RouteProp<HomeStackParamList, 'CreateOrderP2P'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const consumer = useSelector(getConsumer);
  const paymentInfoSet = consumer?.paymentInfoSet() === true;
  // state
  // order is initially undefined to let us know that wasn't been created yet
  // when we set it to null, we're indicating that we're in process of creating it.
  const [origin, setOrigin] = useState(new PlaceImpl({}));
  const [destination, setDestination] = useState(new PlaceImpl({}));
  const [order, setOrder] = useState<OrderImpl | null>(null);
  const [waiting, setWaiting] = useState(false);

  // side effects
  // fires when AddressComplete finishes
  useEffect(() => {
    const { originAddress, destinationAddress } = route.params ?? {};
    if (originAddress) setOrigin(origin.merge({ address: originAddress }));
    if (destinationAddress) setDestination(destination.merge({ address: destinationAddress }));
  }, [route.params]);

  // create order whenever origin or destination changes
  useEffect(() => {
    if (
      origin.valid() &&
      destination.valid() &&
      (!order ||
        order!.getData().origin.address !== origin.getData().address ||
        order!.getData().destination.address !== destination.getData().address)
    ) {
      (async () => {
        setOrder(null);
        setWaiting(true);
        const newOrder = await createOrder(api)(origin.getData(), destination.getData());
        console.log(newOrder);
        setOrder(new OrderImpl(newOrder));
        setWaiting(false);
      })();
    }
  }, [origin, destination]);

  // handlers
  // navigate to 'AddressComplete' to choose type or choose an address
  const navigateToAddressComplete = (currentValue: string, destinationParam: string) => {
    navigation.navigate('AddressComplete', {
      value: currentValue,
      destinationScreen: 'CreateOrderP2P',
      destinationParam,
    });
  };
  // navigate to ProfileEdit screen to allow user fill missing information
  const navigateToFillPaymentInfo = () => {
    navigation.navigate('ProfileCards');
  };
  // confirm order
  const confirmOrderHandler = async () => {
    try {
      const orderId = order!.getData().id;
      // TODO: replace fixed card ID
      const cardId = consumer!.info!.cards![0].id;
      setWaiting(true);
      await confirmOrder(api)(orderId, cardId);
      setWaiting(false);
      navigation.replace('OrderFeedback', { orderId });
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
  };

  // UI
  return (
    <View style={{ ...screens.default }}>
      {/* header */}
      <View style={styles.header}>
        {/* when order hasn't been created yet  */}
        <ShowIf test={!order}>
          {() => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ width: '40%' }}>
                <Text style={{ ...texts.big }}>{t('Transportar Encomendas')}</Text>
              </View>
              <Image source={motocycle} />
            </View>
          )}
        </ShowIf>

        {/* after order has been created */}
        <ShowIf test={order?.valid() === true}>{() => <OrderMap order={order!} />}</ShowIf>
      </View>

      {/* details */}
      <View style={styles.details}>
        {/* progress */}

        {/* pager */}
        <OrderPager
          origin={origin}
          destination={destination}
          order={order}
          paymentInfoSet={paymentInfoSet}
          waiting={waiting}
          navigateToAddressComplete={navigateToAddressComplete}
          navigateToFillPaymentInfo={navigateToFillPaymentInfo}
          confirmOrder={confirmOrderHandler}
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    width,
    height: height * 0.3,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  details: {
    flex: 1,
    padding: 16,
    ...borders.default,
  },
  input: {
    marginTop: 12,
  },
});
