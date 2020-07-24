import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';

import { motocycle } from '../../../../assets/icons';
import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import { getConsumerLocation } from '../../../../store/selectors/consumer';
import { Place, Order } from '../../../../store/types';
import { t } from '../../../../strings';
import { ApiContext } from '../../../../utils/context';
import DefaultButton from '../../../common/DefaultButton';
import DefaultInput from '../../../common/DefaultInput';
import ShowIf from '../../../common/ShowIf';
import Touchable from '../../../common/Touchable';
import { screens, borders } from '../../../common/styles';
import OrderMap from './OrderMap';
import OrderSummary from './OrderSummary';

// import * as fixtures from '../../../../store/fixtures'; // testing only

enum Steps {
  Origin = 0,
  Destination,
  Confirmation,
  ConfirmingOrder,
}

const placeValid = (place: Place): boolean => {
  return orderValid(null);
  // return !!place && !!place.address; // TODO: improve place validation
};

const orderValid = (order: Order | null): boolean => {
  // TODO: improve order validation
  if (!order) return false;
  return true;
};

export default function () {
  // context
  const navigation = useNavigation();
  const route = useRoute();
  const api = useContext(ApiContext);
  const { params } = route;
  const locationPermission = useLocationUpdates(true);

  // refs
  const viewPager = useRef<ViewPager>();

  // state
  const currentLocation = useSelector(getConsumerLocation);

  const [step, setStep] = useState(Steps.Origin);
  const [origin, setOrigin] = useState<Place>({} as Place);
  const [destination, setDestination] = useState<Place>({} as Place);
  const [order, setOrder] = useState<Order | null>(null);

  // handlers
  // navigate to address complete screen
  const navigateToAddressComplete = () => {
    const value = step === Steps.Origin ? origin.address : destination.address;
    const destinationParam = step === Steps.Origin ? 'originAddress' : 'destinationAddress';
    navigation.navigate('AddressComplete', {
      value,
      destinationScreen: 'CreateOrderP2P',
      destinationParam,
    });
  };

  // navigation between steps
  const stepReady = (value: Steps): boolean => {
    if (value === Steps.Origin) return true; // always enabled
    if (value === Steps.Destination) return placeValid(origin); // only if origin is known
    if (value === Steps.Confirmation) return placeValid(origin) && placeValid(destination); // only if both origin and destination is known
    if (value === Steps.ConfirmingOrder) return orderValid(order); // when order
    return false; // should happen
  };

  const setPage = (index: number): void => {
    if (viewPager?.current) viewPager.current.setPage(index);
  };
  const nextPage = (): void => setPage(step + 1);

  const nextStep = async (): Promise<void> => {
    const nextStep = step + 1;
    if (!stepReady(nextStep)) return;
    if (nextStep === Steps.Destination) {
      nextPage();
    } else if (nextStep === Steps.Confirmation) {
      if (order) nextPage();
      else {
        // TODO: alert that order is being created and when it is, go to next step automatically
      }
    } else if (nextStep === Steps.ConfirmingOrder) {
      const confirmationResult = await api.confirmOrder(order!.id, 'YY7ED5T2geh0iSmRS9FZ');
    }
  };

  const onPageScroll = (ev: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };
  // side effects
  // fires when AddressComplete finishes
  useEffect(() => {
    const { originAddress, destinationAddress } = params ?? {};
    console.log('originAddress', originAddress);
    if (originAddress) {
      console.log('set new origin', { ...origin, address: originAddress });
      setOrigin({ ...origin, address: originAddress });
    }
    if (destinationAddress) setDestination({ ...destination, address: destinationAddress });
  }, [route.params]);

  // create order when origin and destination are valid
  // and whenever either address changes
  useEffect(() => {
    const createOrder = async () => {
      console.log('creating order');
      const newOrder = await api.createOrder(origin, destination);
      console.log(newOrder);
      setOrder(newOrder);
    };

    if (
      placeValid(origin) &&
      placeValid(destination) &&
      (order === null ||
        order.origin.address !== origin.address ||
        order.destination.address !== destination.address)
    ) {
      createOrder();
    }
  }, [origin, destination]);

  // UI
  let nextStepTitle;
  if (step === 0) nextStepTitle = t('Confirmar local de retirada');
  else if (step === 1) nextStepTitle = t('Confirmar local de entrega');
  else if (step === 2) nextStepTitle = t('Fazer pedido');

  return (
    <View style={style.screen}>
      {/* header */}
      <View style={style.header}>
        {/* when order hasn't been created yet  */}
        <ShowIf test={!orderValid(order)}>
          {() => (
            <View>
              <Image source={motocycle} />
            </View>
          )}
        </ShowIf>

        {/* after order has been created */}
        <ShowIf test={orderValid(order)}>{() => <OrderMap order={order} />}</ShowIf>
      </View>

      {/* details */}
      <View style={style.details}>
        {/* progress */}

        {/* content */}
        <ViewPager ref={viewPager} style={{ flex: 1 }} onPageScroll={onPageScroll}>
          {/* testing */}
          {/* <View>
            <OrderSummary
              order={fixtures.orderStatusQuote}
              onEdit={() => null}
            />
          </View> */}
          {/* origin step */}
          <View>
            <TouchableWithoutFeedback onPress={navigateToAddressComplete}>
              <View>
                <DefaultInput
                  style={style.input}
                  value={origin.address}
                  title={t('Endereço de retirada')}
                  placeholder={t('Endereço com número')}
                  onFocus={navigateToAddressComplete}
                  onChangeText={navigateToAddressComplete}
                />
              </View>
            </TouchableWithoutFeedback>

            <DefaultInput
              style={style.input}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
            />

            <DefaultInput
              style={style.input}
              title={t('Instruções de retirada')}
              placeholder={t('Informe com quem e o quê deve ser retirado')}
            />
          </View>

          {/* destination step */}
          <View>
            <ShowIf test={placeValid(origin)}>
              {() => (
                <View>
                  <Touchable onPress={navigateToAddressComplete}>
                    <DefaultInput
                      style={style.input}
                      value={destination.address}
                      title={t('Endereço de entrega')}
                      placeholder={t('Endereço com número')}
                      onFocus={navigateToAddressComplete}
                      onChangeText={navigateToAddressComplete}
                    />
                  </Touchable>

                  <DefaultInput
                    style={style.input}
                    title={t('Complemento (se houver)')}
                    placeholder={t('Apartamento, sala, loja, etc.')}
                  />

                  <DefaultInput
                    style={style.input}
                    title={t('Instruções para entrega')}
                    placeholder={t('Informe para quem deve ser entregue')}
                  />
                </View>
              )}
            </ShowIf>
          </View>

          {/* confirmation step */}
          <ShowIf test={orderValid(order)}>
            {() => <OrderSummary order={order} onEdit={setPage} />}
          </ShowIf>
        </ViewPager>

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <DefaultButton styleObject={{ width: '100%' }} title={nextStepTitle} onPress={nextStep} />
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const style = StyleSheet.create({
  screen: {
    ...screens.default,
  },
  header: {
    width,
    height: height * 0.3,
    justifyContent: 'space-between',
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
