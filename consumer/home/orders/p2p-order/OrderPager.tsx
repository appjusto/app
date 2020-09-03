import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import React, { useRef, useState } from 'react';
import { View, NativeSyntheticEvent } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../../common/components/texts/LabeledText';
import PaddedView from '../../../../common/components/views/PaddedView';
import { Card } from '../../../../common/store/consumer/types';
import OrderImpl from '../../../../common/store/order/types/OrderImpl';
import PlaceImpl from '../../../../common/store/order/types/PlaceImpl';
import { showToast } from '../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { padding } from '../../../../common/styles';
import { t } from '../../../../strings';
import OrderStep from './OrderStep';
import OrderSummary from './OrderSummary';
import { Steps } from './types';

type Props = {
  origin: PlaceImpl;
  destination: PlaceImpl;
  order: OrderImpl | null;
  card: Card | null;
  navigateToAddressComplete: (value: string, returnParam: string) => void;
  navigateToFillPaymentInfo: () => void;
  confirmOrder: () => Promise<void>;
};

export default function ({
  origin,
  destination,
  order,
  card,
  navigateToAddressComplete,
  navigateToFillPaymentInfo,
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
    if (value === Steps.Destination) return origin.valid(); // only if origin is known
    if (value === Steps.Confirmation) return destination.valid() && order?.valid() === true; // only if order has been created
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
      if (nextStep === Steps.ConfirmingOrder) {
        await confirmOrder();
      } else {
        nextPage();
      }
    } else {
      if (nextStep === Steps.Destination) {
        dispatch(showToast(t('Preencha o endereço e as instruções de retirada.')));
      } else if (nextStep === Steps.Confirmation) {
        if (!destination.valid()) {
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
              navigateToAddressComplete(origin.address ?? '', 'origin');
            }}
          >
            <View>
              <LabeledText title={t('Endereço de retirada')}>
                {origin.getData().address ?? t('Endereço com número')}
              </LabeledText>
            </View>
          </TouchableWithoutFeedback>

          <DefaultInput
            style={{ marginTop: padding }}
            title={t('Complemento (se houver)')}
            placeholder={t('Apartamento, sala, loja, etc.')}
          />

          <DefaultInput
            style={{ marginTop: padding }}
            title={t('Instruções para retirada')}
            placeholder={t('Quem irá atender o entregador, etc.')}
          />

          <View style={{ flex: 1 }} />

          <DefaultButton
            title={t('Confirmar local de retirada')}
            onPress={nextStepHandler}
            disabled={!stepReady(step + 1)}
          />
        </PaddedView>

        {/* destination */}
        {origin.valid() && (
          <PaddedView style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigateToAddressComplete(destination.address ?? '', 'destination');
              }}
            >
              <LabeledText style={{ marginTop: padding }} title={t('Endereço de entrega')}>
                {destination.getData().address ?? t('Endereço com número')}
              </LabeledText>
            </TouchableWithoutFeedback>

            <DefaultInput
              style={{ marginTop: padding }}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
            />

            <DefaultInput
              style={{ marginTop: padding }}
              title={t('Instruções para entrega')}
              placeholder={t('Quem irá atender o entregador, etc.')}
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
        {order?.valid() === true && (
          <OrderSummary
            order={order!}
            card={card}
            waiting={busy}
            editStepHandler={setPage}
            nextStepHandler={nextStepHandler}
            navigateToFillPaymentInfo={navigateToFillPaymentInfo}
          />
        )}
      </ViewPager>
    </View>
  );
}
