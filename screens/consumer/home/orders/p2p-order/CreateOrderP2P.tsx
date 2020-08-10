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
} from 'react-native';
import { useDispatch } from 'react-redux';

import { motocycle } from '../../../../../assets/icons';
import { createOrder } from '../../../../../store/order/actions';
import { Place, Order } from '../../../../../store/order/types';
import { showToast } from '../../../../../store/ui/actions';
import { t } from '../../../../../strings';
import { ApiContext } from '../../../../app/context';
import DefaultButton from '../../../../common/DefaultButton';
import DefaultInput from '../../../../common/DefaultInput';
import LabeledText from '../../../../common/LabeledText';
import ShowIf from '../../../../common/ShowIf';
import { screens, borders, texts } from '../../../../common/styles';
import { HomeStackParamList } from '../../types';
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

const orderValid = (order: Order | undefined | null): boolean => {
  // TODO: improve order validation
  if (!order) return false;
  return true;
};

const paymentValid = (): boolean => {
  return false;
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
  const [order, setOrder] = useState<Order | undefined | null>(undefined);

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

  const navigateToProfileEdit = () => {
    navigation.navigate('ProfileEdit', {
      nextScreen: 'ProfileCards',
      nextScreenParams: {
        popCount: 2,
      },
      hideDeleteAccount: true,
    });
  };

  // navigation between steps
  const stepReady = (value: Steps): boolean => {
    if (value === Steps.Origin) return true; // always enabled
    if (value === Steps.Destination) return placeValid(origin); // only if origin is known
    if (value === Steps.Confirmation) return placeValid(destination) && orderValid(order); // only if order has been created
    if (value === Steps.ConfirmingOrder) return paymentValid(); // when if payment informaton is known
    return false; // should never happen
  };

  const setPage = (index: number): void => {
    if (viewPager?.current) viewPager.current.setPage(index);
  };
  const nextPage = (): void => setPage(step + 1);

  const nextStep = async (): Promise<void> => {
    const nextStep = step + 1;
    if (nextStep === Steps.Destination) {
      if (!stepReady(nextStep)) {
        dispatch(showToast(t('Preencha o endereço e as instruções de retirada.')));
      } else {
        nextPage();
      }
    } else if (nextStep === Steps.Confirmation) {
      if (!stepReady(nextStep)) {
        if (!placeValid(destination)) {
          dispatch(showToast(t('Preencha o endereço e as instruções de entrega.')));
        } else if (!order) {
          dispatch(showToast(t('Aguarde enquanto a cotação é feita.')));
        }
      } else {
        nextPage();
      }
    } else if (nextStep === Steps.ConfirmingOrder) {
      if (!stepReady(nextStep)) {
        dispatch(showToast(t('É preciso definir um meio de pagamento para finalizar o pedido.')));
      } else {
        // TODO: replace hardcoded card ID
        const confirmationResult = await api
          .order()
          .confirmOrder(order!.id, 'YY7ED5T2geh0iSmRS9FZ');
      }
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

  // create order whenever origin or destination changes
  useEffect(() => {
    if (
      placeValid(origin) &&
      placeValid(destination) &&
      (!order ||
        order.origin.address !== origin.address ||
        order.destination.address !== destination.address)
    ) {
      (async () => {
        setOrder(null);
        const newOrder = await createOrder(api)(origin, destination);
        console.log(newOrder);
        setOrder(newOrder);
      })();
    }
  }, [origin, destination]);

  // UI
  function NextStepButton() {
    let title = '';
    if (step === 0) title = t('Confirmar local de retirada');
    else if (step === 1) title = t('Confirmar local de entrega');
    else if (step === 2) title = t('Fazer pedido');
    const nexStepReady = stepReady(step + 1);
    // order null (instead of undefined) means that we're waiting for the backend create the order
    const activityIndicator = step === 1 && order === null;
    return (
      <DefaultButton
        styleObject={{ width: '100%' }}
        title={title}
        onPress={nextStep}
        disabled={!nexStepReady}
        activityIndicator={activityIndicator}
      />
    );
  }

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
          <ShowIf test={step !== Steps.Confirmation || paymentValid()}>
            {() => <NextStepButton />}
          </ShowIf>
          <ShowIf test={step === Steps.Confirmation && !paymentValid()}>
            {() => (
              <DefaultButton
                styleObject={{ width: '100%' }}
                title={t('Completar dados e forma de pagamento')}
                onPress={navigateToProfileEdit}
              />
            )}
          </ShowIf>
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
