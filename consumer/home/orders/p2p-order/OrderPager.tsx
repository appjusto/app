import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { Fleet, Order, Place, WithId } from 'appjusto-types';
import { IuguCustomerPaymentMethod } from 'appjusto-types/payment/iugu';
import React from 'react';
import { Image, NativeSyntheticEvent, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as icons from '../../../../assets/icons';
import { ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../../common/components/texts/LabeledText';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
import { doublePadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import OrderSummary from '../summary/OrderSummary';
import OrderStep from './OrderStep';
import { Steps } from './types';

type Props = {
  order: WithId<Order> | undefined;
  paymentMethod?: IuguCustomerPaymentMethod;
  isLoading: boolean;
  navigateToAddressComplete: (returnParam: string, value?: Place) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleet: WithId<Fleet>) => void;
  navigateToTransportableItems: () => void;
  placeOrder: (fleetId: string, platformFee: number) => Promise<void>;
};

export default function ({
  order,
  paymentMethod,
  isLoading,
  navigateToAddressComplete,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
  navigateToTransportableItems,
  placeOrder,
}: Props) {
  // params
  const { origin, destination } = order ?? {};
  // context
  const api = React.useContext(ApiContext);
  // state
  const [step, setStep] = React.useState(Steps.Origin);
  const [originAdditionalInfo, setOriginAdditionalInfo] = React.useState(
    origin?.additionalInfo ?? ''
  );
  const [originInstructions, setOriginInstructions] = React.useState(origin?.intructions ?? '');
  const [destinationAdditionalInfo, setDestinationAdditionalInfo] = React.useState(
    destination?.additionalInfo ?? ''
  );
  const [destinationInstructions, setDestinationInstructions] = React.useState(
    destination?.intructions ?? ''
  );
  // side effects
  React.useEffect(() => {
    if (order?.origin?.additionalInfo !== undefined)
      setOriginAdditionalInfo(order.origin.additionalInfo);
    if (order?.origin?.intructions !== undefined) setOriginInstructions(order.origin.intructions);
    if (order?.destination?.additionalInfo !== undefined)
      setDestinationAdditionalInfo(order.destination.additionalInfo);
    if (order?.destination?.intructions !== undefined)
      setDestinationInstructions(order.destination.intructions);
  }, [order]);
  // refs
  const viewPager = React.useRef<ViewPager>(null);
  // helpers
  const stepReady = (value: Steps): boolean => {
    if (value === Steps.Origin) return true; // always enabled
    if (value === Steps.Destination) return Boolean(origin?.address.description); // only if origin is known
    if (value === Steps.Confirmation) return Boolean(destination?.address.description) && !!order; // only if order has been created
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
    const nextStep: Steps = step + 1;
    if (stepReady(nextStep)) {
      if (step === Steps.Origin) {
        if (!origin) return;
        api.order().updateFoodOrder(order!.id, {
          origin: {
            ...origin,
            additionalInfo: originAdditionalInfo,
            intructions: originInstructions,
          },
        });
      } else if (step === Steps.Destination) {
        if (!destination) return;
        api.order().updateFoodOrder(order!.id, {
          destination: {
            ...destination,
            additionalInfo: destinationAdditionalInfo,
            intructions: destinationInstructions,
          },
        });
      }
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
  // UI
  const tallerDevice = useTallerDevice();
  const verticalPadding = tallerDevice ? doublePadding : padding;
  return (
    <View style={{ ...screens.default }}>
      <OrderStep step={step} changeStepHandler={setPage} />

      <ViewPager ref={viewPager} style={{ flex: 1 }} onPageScroll={onPageScroll}>
        {/* origin */}
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
            <TouchableWithoutFeedback
              onPress={() => {
                navigateToAddressComplete('origin', origin);
              }}
            >
              <LabeledText title={t('Endereço de retirada')}>
                {origin?.address?.main ?? t('Endereço com número')}
              </LabeledText>
            </TouchableWithoutFeedback>

            <DefaultInput
              style={{ marginTop: verticalPadding }}
              value={originAdditionalInfo}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
              onChangeText={(text) => setOriginAdditionalInfo(text)}
              editable={Boolean(origin)}
            />

            <DefaultInput
              style={{ marginTop: verticalPadding }}
              value={originInstructions}
              title={t('Instruções para entrega')}
              placeholder={t('Quem irá atender o entregador, etc.')}
              onChangeText={(text) => setOriginInstructions(text)}
              editable={Boolean(origin)}
              blurOnSubmit
              multiline
              // numberOfLines={3}
            />

            <TouchableWithoutFeedback onPress={navigateToTransportableItems}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Image source={icons.info} />
                <Text style={{ ...texts.small, marginLeft: 4 }}>
                  {t('O que pode ser transportado')}
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
        {Boolean(origin?.address.description) && (
          <View style={{ flex: 1, paddingHorizontal: padding }}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
              <TouchableWithoutFeedback
                onPress={() => {
                  navigateToAddressComplete('destination', destination);
                }}
              >
                <LabeledText title={t('Endereço de entrega')}>
                  {destination?.address?.main ?? t('Endereço com número')}
                </LabeledText>
              </TouchableWithoutFeedback>

              <DefaultInput
                style={{ marginTop: verticalPadding }}
                value={destinationAdditionalInfo}
                title={t('Complemento (se houver)')}
                placeholder={t('Apartamento, sala, loja, etc.')}
                onChangeText={(text) => setDestinationAdditionalInfo(text)}
              />

              <DefaultInput
                style={{ marginTop: verticalPadding }}
                value={destinationInstructions}
                title={t('Instruções para entrega')}
                placeholder={t('Quem irá atender o entregador, etc.')}
                onChangeText={(text) => setDestinationInstructions(text)}
                blurOnSubmit
                multiline
                numberOfLines={3}
              />

              <TouchableWithoutFeedback onPress={navigateToTransportableItems}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
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
                activityIndicator={
                  step === Steps.Destination &&
                  Boolean(order?.destination?.address.description) &&
                  !order?.route
                }
              />
            </KeyboardAwareScrollView>
          </View>
        )}

        {/* confirmation */}
        {Boolean(order?.route) && (
          <OrderSummary
            order={order!}
            paymentMethod={paymentMethod}
            waiting={isLoading}
            editStepHandler={setPage}
            placeOrder={placeOrder}
            navigateToFillPaymentInfo={navigateToFillPaymentInfo}
            navigateFleetDetail={navigateFleetDetail}
          />
        )}
      </ViewPager>
    </View>
  );
}
