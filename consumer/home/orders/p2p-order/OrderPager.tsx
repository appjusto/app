import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { Card, Place, Order, WithId, Fleet } from 'appjusto-types';
import React, { useRef, useState } from 'react';
import { View, NativeSyntheticEvent } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../../common/components/texts/LabeledText';
import { placeValid } from '../../../../common/store/order/validators';
import { showToast } from '../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { padding } from '../../../../common/styles';
import { t } from '../../../../strings';
import OrderStep from './OrderStep';
import OrderSummary from './OrderSummary';
import { Steps } from './types';

type Props = {
  origin: Partial<Place>;
  destination: Partial<Place>;
  order?: WithId<Order>;
  card?: Card;
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
  card,
  updateOrigin,
  updateDestination,
  navigateToAddressComplete,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
  confirmOrder,
}: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();

  // refs
  const viewPager = useRef<ViewPager>(null);

  // app state
  const busy = useSelector(getUIBusy);

  // state
  const [step, setStep] = useState(Steps.Origin);

  // helpers
  const stepReady = (value: Steps): boolean => {
    if (value === Steps.Origin) return true; // always enabled
    if (value === Steps.Destination) return placeValid(origin); // only if origin is known
    if (value === Steps.Confirmation) return placeValid(destination) && !!order; // only if order has been created
    if (value === Steps.ConfirmingOrder) return !!card;
    return false; // should never happen
  };

  const setPage = (index: number): void => {
    if (stepReady(index)) {
      if (viewPager?.current) viewPager.current.setPage(index);
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
    } else {
      if (nextStep === Steps.Destination) {
        dispatch(showToast(t('Preencha o endereço e as instruções de retirada.')));
      } else if (nextStep === Steps.Confirmation) {
        if (!placeValid(destination)) {
          dispatch(showToast(t('Preencha o endereço e as instruções de entrega.')));
        } else if (!order) {
          dispatch(showToast(t('Aguarde enquanto a cotação é feita.')));
        }
      } else if (nextStep === Steps.ConfirmingOrder) {
        dispatch(showToast(t('É preciso definir um meio de pagamento para finalizar o pedido.')));
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

  return (
    <View style={{ flex: 1 }}>
      <PaddedView>
        <OrderStep step={step} changeStepHandler={setPage} />
      </PaddedView>

      <ViewPager ref={viewPager} style={{ flex: 1 }} onPageScroll={onPageScroll}>
        {/* origin */}
        <PaddedView style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigateToAddressComplete(origin.address?.description ?? '', 'origin');
            }}
          >
            <LabeledText title={t('Endereço de retirada')}>
              {origin.address?.description ?? t('Endereço com número')}
            </LabeledText>
          </TouchableWithoutFeedback>

          <DefaultInput
            style={{ marginTop: padding }}
            value={origin.additionalInfo ?? ''}
            title={t('Complemento (se houver)')}
            placeholder={t('Apartamento, sala, loja, etc.')}
            onChangeText={(text) => updateOrigin({ ...origin, additionalInfo: text })}
          />

          <DefaultInput
            style={{ marginTop: padding }}
            value={origin.intructions ?? ''}
            title={t('Instruções para entrega')}
            placeholder={t('Quem irá atender o entregador, etc.')}
            onChangeText={(text) => updateOrigin({ ...origin, intructions: text })}
            blurOnSubmit
            multiline
            numberOfLines={3}
          />

          <View style={{ flex: 1 }} />

          <DefaultButton
            title={t('Confirmar local de retirada')}
            onPress={nextStepHandler}
            disabled={!stepReady(step + 1)}
          />
        </PaddedView>

        {/* destination */}
        {placeValid(origin) && (
          <PaddedView style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigateToAddressComplete(destination?.address?.description ?? '', 'destination');
              }}
            >
              <LabeledText title={t('Endereço de entrega')}>
                {destination.address?.description ?? t('Endereço com número')}
              </LabeledText>
            </TouchableWithoutFeedback>

            <DefaultInput
              style={{ marginTop: padding }}
              value={destination.additionalInfo ?? ''}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
              onChangeText={(text) => updateDestination({ ...destination, additionalInfo: text })}
            />

            <DefaultInput
              style={{ marginTop: padding }}
              value={destination.intructions ?? ''}
              title={t('Instruções para entrega')}
              placeholder={t('Quem irá atender o entregador, etc.')}
              onChangeText={(text) => updateDestination({ ...destination, intructions: text })}
              blurOnSubmit
              multiline
              numberOfLines={3}
            />

            <View style={{ flex: 1 }} />

            <DefaultButton
              title={t('Confirmar local de entrega')}
              onPress={nextStepHandler}
              disabled={!stepReady(step + 1)}
              activityIndicator={step === Steps.Destination && busy}
            />
          </PaddedView>
        )}

        {/* confirmation */}
        {!!order && (
          <OrderSummary
            order={order}
            card={card}
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
