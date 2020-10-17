import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { StackNavigationProp } from '@react-navigation/stack';
import { Place, Order, WithId, Fleet } from 'appjusto-types';
import { IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
import React, { useRef, useState } from 'react';
import { View, NativeSyntheticEvent, Text, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

import * as icons from '../../../../assets/icons';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../../common/components/texts/LabeledText';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
import { placeValid } from '../../../../common/store/order/validators';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { doublePadding, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { HomeNavigatorParamList } from '../../types';
import OrderStep from './OrderStep';
import OrderSummary from './OrderSummary';
import { Steps } from './types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'CreateOrderP2P'>;

type Props = {
  origin: Partial<Place>;
  destination: Partial<Place>;
  order?: WithId<Order>;
  paymentMethod?: IuguCustomerPaymentMethod;
  navigation: ScreenNavigationProp;
  updateOrigin: (value: Partial<Place>) => void;
  updateDestination: (value: Partial<Place>) => void;
  navigateToAddressComplete: (value: string, returnParam: string) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleet: Fleet) => void;
  confirmOrder: (fleetId: string, platformFee: number) => Promise<void>;
};

export default function ({
  origin,
  destination,
  order,
  paymentMethod,
  navigation,
  updateOrigin,
  updateDestination,
  navigateToAddressComplete,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
  confirmOrder,
}: Props) {
  // refs
  const viewPager = useRef<ViewPager>(null);

  // context
  const tallerDevice = useTallerDevice();

  // app state
  const busy = useSelector(getUIBusy);

  // state
  const [step, setStep] = useState(Steps.Origin);

  // helpers
  const stepReady = (value: Steps): boolean => {
    if (value === Steps.Origin) return true; // always enabled
    if (value === Steps.Destination) return placeValid(origin); // only if origin is known
    if (value === Steps.Confirmation) return placeValid(destination) && !!order; // only if order has been created
    if (value === Steps.ConfirmingOrder) return !!paymentMethod;
    return false; // should never happen
  };

  const setPage = (index: number): void => {
    if (stepReady(index)) {
      viewPager?.current?.setPage(index);
    }
  };
  const nextPage = (): void => setPage(step + 1);

  // handlers
  // when user press next button
  const nextStepHandler = async (): Promise<void> => {
    const nextStep = step + 1;
    if (stepReady(nextStep)) {
      if (nextStep !== Steps.ConfirmingOrder) {
        nextPage();
      }
    }
  };

  // change the step as user's scroll between pages
  const onPageScroll = (ev: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };

  const verticalPadding = tallerDevice ? doublePadding : padding;
  return (
    <View style={{ ...screens.default }}>
      <OrderStep step={step} changeStepHandler={setPage} />

      <ViewPager ref={viewPager} style={{ flex: 1 }} onPageScroll={onPageScroll}>
        {/* origin */}
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <KeyboardAwareScrollView>
            <TouchableWithoutFeedback
              onPress={() => {
                navigateToAddressComplete(origin.address?.description ?? '', 'origin');
              }}
            >
              <LabeledText title={t('Endereço de retirada')}>
                {origin.address?.main ?? t('Endereço com número')}
              </LabeledText>
            </TouchableWithoutFeedback>

            <DefaultInput
              style={{ marginTop: verticalPadding }}
              value={origin.additionalInfo ?? ''}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
              onChangeText={(text) => updateOrigin({ ...origin, additionalInfo: text })}
            />

            <DefaultInput
              style={{ marginTop: verticalPadding }}
              value={origin.intructions ?? ''}
              title={t('Instruções para entrega')}
              placeholder={t('Quem irá atender o entregador, etc.')}
              onChangeText={(text) => updateOrigin({ ...origin, intructions: text })}
              blurOnSubmit
              multiline
              numberOfLines={3}
            />

            <TouchableWithoutFeedback onPress={() => navigation.navigate('TransportableItems')}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: verticalPadding,
                }}
              >
                <Image source={icons.info} />
                <Text style={{ ...texts.small, marginLeft: 4 }}>
                  {t('Saiba o que pode ser transportado')}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <DefaultButton
              style={{ marginVertical: verticalPadding }}
              title={t('Confirmar local de retirada')}
              onPress={nextStepHandler}
              disabled={!stepReady(step + 1)}
            />
          </KeyboardAwareScrollView>
        </View>

        {/* destination */}
        {placeValid(origin) && (
          <View style={{ flex: 1, paddingHorizontal: padding }}>
            <KeyboardAwareScrollView>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigateToAddressComplete(destination?.address?.description ?? '', 'destination');
                }}
              >
                <LabeledText title={t('Endereço de entrega')}>
                  {destination.address?.main ?? t('Endereço com número')}
                </LabeledText>
              </TouchableWithoutFeedback>

              <DefaultInput
                style={{ marginTop: verticalPadding }}
                value={destination.additionalInfo ?? ''}
                title={t('Complemento (se houver)')}
                placeholder={t('Apartamento, sala, loja, etc.')}
                onChangeText={(text) => updateDestination({ ...destination, additionalInfo: text })}
              />

              <DefaultInput
                style={{ marginTop: verticalPadding }}
                value={destination.intructions ?? ''}
                title={t('Instruções para entrega')}
                placeholder={t('Quem irá atender o entregador, etc.')}
                onChangeText={(text) => updateDestination({ ...destination, intructions: text })}
                blurOnSubmit
                multiline
                numberOfLines={3}
              />

              <TouchableWithoutFeedback onPress={() => navigation.navigate('TransportableItems')}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: verticalPadding,
                  }}
                >
                  <Image source={icons.info} />
                  <Text style={{ ...texts.small, marginLeft: 4 }}>
                    {t('Saiba o que pode ser transportado')}
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <DefaultButton
                style={{ marginVertical: verticalPadding }}
                title={t('Confirmar local de entrega')}
                onPress={nextStepHandler}
                disabled={!stepReady(step + 1)}
                activityIndicator={step === Steps.Destination && busy}
              />
            </KeyboardAwareScrollView>
          </View>
        )}

        {/* confirmation */}
        {!!order && (
          <OrderSummary
            origin={origin}
            destination={destination}
            order={order}
            paymentMethod={paymentMethod}
            waiting={busy}
            editStepHandler={setPage}
            confirmOrder={confirmOrder}
            navigateToFillPaymentInfo={navigateToFillPaymentInfo}
            navigateFleetDetail={navigateFleetDetail}
          />
        )}
      </ViewPager>
    </View>
  );
}
