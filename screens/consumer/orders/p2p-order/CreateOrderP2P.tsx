import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { motocycle } from '../../../../assets/icons';
import { Place, Order } from '../../../../store/types';
import { showToast } from '../../../../store/ui/actions';
import { t } from '../../../../strings';
import { ApiContext } from '../../../app/context';
import DefaultButton from '../../../common/DefaultButton';
import DefaultInput from '../../../common/DefaultInput';
import LabeledText from '../../../common/LabeledText';
import ShowIf from '../../../common/ShowIf';
import { screens, borders, texts } from '../../../common/styles';
import { HomeStackParamList } from '../../home/types';
import OrderMap from './OrderMap';
import OrderSummary from './OrderSummary';

type ScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CreateOrderP2P'>;
type ScreenRouteProp = RouteProp<HomeStackParamList, 'CreateOrderP2P'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

enum Steps {
  Origin = 0,
  Destination,
  Confirmation,
  ConfirmingOrder,
}

const placeValid = (place: Place): boolean => {
  // TODO: improve place validation
  return !!place && !!place.address;
};

const orderValid = (order: Order | null): boolean => {
  // TODO: improve order validation
  if (!order) return false;
  return true;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch();
  const { params } = route;

  // refs
  const viewPager = useRef<ViewPager>(null);

  // state
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
        dispatch(showToast(t('Aguarde enquanto fazemos a cotação...')));
      }
    } else if (nextStep === Steps.ConfirmingOrder) {
      const confirmationResult = await api.order().confirmOrder(order!.id, 'YY7ED5T2geh0iSmRS9FZ');
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
      const newOrder = await api.order().createOrder(origin, destination);
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

  // whenever order changes
  useEffect(() => {
    if (!order) return;
    nextPage();
  }, [order]);

  // UI
  let nextStepTitle = '';
  if (step === 0) nextStepTitle = t('Confirmar local de retirada');
  else if (step === 1) nextStepTitle = t('Confirmar local de entrega');
  else if (step === 2) nextStepTitle = t('Fazer pedido');

  return (
    <View style={{ ...screens.default }}>
      {/* header */}
      <View style={style.header}>
        {/* when order hasn't been created yet  */}
        <ShowIf test={!orderValid(order)}>
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
                <LabeledText style={style.input} title={t('Endereço de retirada')}>
                  {origin.address ?? t('Endereço com número')}
                </LabeledText>
              </View>
            </TouchableWithoutFeedback>

            <DefaultInput
              style={style.input}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
            />

            <DefaultInput
              style={style.input}
              title={t('Descrição curta')}
              placeholder={t('Qual encomenda será transportada')}
            />
          </View>

          {/* destination step */}
          <View style={{ flex: 1 }}>
            <ShowIf test={placeValid(origin)}>
              {() => (
                <View>
                  <TouchableWithoutFeedback onPress={navigateToAddressComplete}>
                    <LabeledText style={style.input} title={t('Endereço de entrega')}>
                      {destination.address ?? t('Endereço com número')}
                    </LabeledText>
                  </TouchableWithoutFeedback>

                  <DefaultInput
                    style={style.input}
                    title={t('Complemento (se houver)')}
                    placeholder={t('Apartamento, sala, loja, etc.')}
                  />

                  <DefaultInput
                    style={[style.input]}
                    title={t('Responsável no local')}
                    placeholder={t('Entregar para')}
                  />
                </View>
              )}
            </ShowIf>
          </View>

          {/* confirmation step */}
          <View style={{ flex: 1 }}>
            <ShowIf test={orderValid(order)}>
              {() => (
                <View style={{ flex: 1 }}>
                  <OrderSummary order={order!} onEdit={setPage} />
                </View>
              )}
            </ShowIf>
          </View>
        </ViewPager>

        <View style={{ justifyContent: 'flex-end' }}>
          <DefaultButton styleObject={{ width: '100%' }} title={nextStepTitle} onPress={nextStep} />
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const style = StyleSheet.create({
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
