import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import React, { useRef, useState } from 'react';
import { View, NativeSyntheticEvent } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import OrderImpl from '../../../../../store/order/types/OrderImpl';
import PlaceImpl from '../../../../../store/order/types/PlaceImpl';
import { showToast } from '../../../../../store/ui/actions';
import { t } from '../../../../../strings';
import { AppDispatch } from '../../../../app/context';
import DefaultButton from '../../../../common/DefaultButton';
import DefaultInput from '../../../../common/DefaultInput';
import LabeledText from '../../../../common/LabeledText';
import ShowIf from '../../../../common/ShowIf';
import { padding } from '../../../../common/styles';
import OrderSummary from './OrderSummary';

enum Steps {
  Origin = 0,
  Destination,
  Confirmation,
  ConfirmingOrder,
}

type Props = {
  origin: PlaceImpl;
  destination: PlaceImpl;
  order?: OrderImpl | null;
  paymentInfoSet: boolean;
  waiting: boolean;
  navigateToAddressComplete: (currentValue: string, destinationParam: string) => void;
  navigateToFillPaymentInfo: () => void;
  confirmOrder: () => Promise<void>;
};

export default function ({
  origin,
  destination,
  order,
  paymentInfoSet,
  waiting,
  navigateToAddressComplete,
  navigateToFillPaymentInfo,
  confirmOrder,
}: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();

  // refs
  const viewPager = useRef<ViewPager>(null);

  // state
  const [step, setStep] = useState(Steps.Origin);

  // helpers
  const stepReady = (value: Steps): boolean => {
    if (value === Steps.Origin) return true; // always enabled
    if (value === Steps.Destination) return origin.valid(); // only if origin is known
    if (value === Steps.Confirmation) return destination.valid() && order?.valid() === true; // only if order has been created
    if (value === Steps.ConfirmingOrder) return paymentInfoSet;
    return false; // should never happen
  };

  const setPage = (index: number): void => {
    if (viewPager?.current) viewPager.current.setPage(index);
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

  // UI
  const getNextStepTitle = (step: Steps) => {
    if (step === Steps.Origin) return t('Confirmar local de retirada');
    else if (step === 1) return t('Confirmar local de entrega');
    else if (step === 2) return t('Fazer pedido');
    return '';
  };

  return (
    <View style={{ flex: 1 }}>
      <ViewPager ref={viewPager} style={{ flex: 1 }} onPageScroll={onPageScroll}>
        {/* origin */}
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              navigateToAddressComplete(origin.getData().address ?? '', 'originAddress');
            }}
          >
            <View>
              <LabeledText style={{ marginTop: padding }} title={t('Endereço de retirada')}>
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
            title={t('Descrição curta')}
            placeholder={t('Qual encomenda será transportada')}
          />
        </View>

        {/* destination */}
        <ShowIf test={origin.valid()}>
          {() => (
            <View>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigateToAddressComplete(
                    destination.getData().address ?? '',
                    'destinationAddress'
                  );
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
                title={t('Responsável no local')}
                placeholder={t('Entregar para')}
              />
            </View>
          )}
        </ShowIf>

        {/* confirmation */}
        <ShowIf test={order?.valid() === true}>
          {() => <OrderSummary order={order!} onEdit={setPage} />}
        </ShowIf>
      </ViewPager>
      <View style={{ justifyContent: 'flex-end' }}>
        <ShowIf test={step !== Steps.Confirmation || paymentInfoSet}>
          {() => (
            <DefaultButton
              title={getNextStepTitle(step)}
              onPress={nextStepHandler}
              disabled={!stepReady(step + 1)}
              activityIndicator={waiting}
            />
          )}
        </ShowIf>
        <ShowIf test={step === Steps.Confirmation && !paymentInfoSet}>
          {() => (
            <DefaultButton
              style={{ width: '100%' }}
              title={t('Incluir forma de pagamento')}
              onPress={navigateToFillPaymentInfo}
            />
          )}
        </ShowIf>
      </View>
    </View>
  );
}
