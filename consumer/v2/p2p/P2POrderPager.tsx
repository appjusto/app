import { Feather } from '@expo/vector-icons';
import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { Fleet, Order, Place, WithId } from 'appjusto-types';
import React from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { StepControl } from '../../../common/components/controls/step-control/StepControl';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../common/components/texts/LabeledText';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { doublePadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderSummary } from '../common/order-summary/OrderSummary';
import { Step } from './types';

type Props = {
  order: WithId<Order> | undefined;
  selectedPaymentMethodId?: string;
  isLoading: boolean;
  navigateToAddressComplete: (returnParam: string, value?: Place) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleet: WithId<Fleet>) => void;
  navigateToTransportableItems: () => void;
  placeOrder: (fleetId: string) => Promise<void>;
  navigateToPixPayment: (total: number, fleetId: string) => void;
  navigateToFinishProfile: () => void;
};

export default function ({
  order,
  selectedPaymentMethodId,
  isLoading,
  navigateToAddressComplete,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
  navigateToTransportableItems,
  placeOrder,
  navigateToPixPayment,
  navigateToFinishProfile,
}: Props) {
  // params
  const { origin, destination } = order ?? {};
  // context
  const api = React.useContext(ApiContext);
  // state
  const [step, setStep] = React.useState(Step.Origin);
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
  const stepReady = (value: Step): boolean => {
    if (value === Step.Origin) return true; // always enabled
    if (value === Step.Destination) return Boolean(origin?.address.description); // only if origin is known
    if (value === Step.Confirmation) return Boolean(destination?.address.description) && !!order; // only if order has been created
    if (value === Step.ConfirmingOrder) return Boolean(selectedPaymentMethodId);
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
    const nextStep: Step = step + 1;
    if (stepReady(nextStep)) {
      if (step === Step.Origin) {
        if (!origin) return;
        api.order().updateOrder(order!.id, {
          origin: {
            ...origin,
            additionalInfo: originAdditionalInfo,
            intructions: originInstructions,
          },
        });
      } else if (step === Step.Destination) {
        if (!destination) return;
        api.order().updateOrder(order!.id, {
          destination: {
            ...destination,
            additionalInfo: destinationAdditionalInfo,
            intructions: destinationInstructions,
          },
        });
      }
      if (nextStep !== Step.ConfirmingOrder) {
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
  const isDeviceTaller = useTallerDevice();
  const verticalPadding = isDeviceTaller ? doublePadding : padding;
  return (
    <View style={{ ...screens.default }}>
      <StepControl
        style={{ padding }}
        labels={[t('Retirada'), t('Entrega'), t('Confirmação')]}
        activeIndex={step}
        onChange={setPage}
      />

      <ViewPager ref={viewPager} style={{ flex: 1 }} onPageScroll={onPageScroll}>
        {/* origin */}
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
            <Pressable
              onPress={() => {
                navigateToAddressComplete('origin', origin);
              }}
            >
              <LabeledText title={t('Endereço de retirada')} placeholder={t('Endereço com número')}>
                {origin?.address?.main}
              </LabeledText>
            </Pressable>

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
                  marginTop: padding,
                }}
              >
                <Feather name="info" size={14} />
                <Text style={{ ...texts.xs, marginLeft: 4 }}>
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
              <Pressable
                onPress={() => {
                  navigateToAddressComplete('destination', destination ?? undefined);
                }}
              >
                <LabeledText
                  title={t('Endereço de entrega')}
                  placeholder={t('Endereço com número')}
                >
                  {destination?.address?.main}
                </LabeledText>
              </Pressable>

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
                    marginTop: padding,
                  }}
                >
                  <Feather name="info" size={14} />
                  <Text style={{ ...texts.xs, marginLeft: 4 }}>
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
                  step === Step.Destination &&
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
            selectedPaymentMethodId={selectedPaymentMethodId}
            waiting={isLoading}
            showMap={!isDeviceTaller}
            onEditStep={setPage}
            placeOrder={placeOrder}
            navigateToFillPaymentInfo={navigateToFillPaymentInfo}
            navigateFleetDetail={navigateFleetDetail}
            modalVisible={false}
            navigateToPixPayment={navigateToPixPayment}
            navigateToFinishProfile={navigateToFinishProfile}
          />
        )}
      </ViewPager>
    </View>
  );
}
