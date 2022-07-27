import { Fare, Order, PayableWith, Place, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PagerView, { PagerViewOnPageSelectedEventData } from 'react-native-pager-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { StepControl } from '../../../common/components/controls/step-control/StepControl';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../common/components/texts/LabeledText';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderCostBreakdown } from '../common/breakdown/OrderCostBreakdown';
import { OrderAvailableFleets } from '../common/order-summary/OrderAvailableFleets';
import { OrderPayment } from '../common/order-summary/OrderPayment';
import { OrderSummary } from '../common/order-summary/OrderSummary';
import { OrderTotal } from '../common/order-summary/OrderTotal';
import { Step } from './types';

type Props = {
  order: WithId<Order> | undefined;
  selectedPaymentMethodId?: string;
  isLoading: boolean;
  navigateToAddressComplete: (returnParam: string, value?: Place) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleetId: string) => void;
  navigateToTransportableItems: () => void;
  onSubmit: () => void;
  navigateToPixPayment: (total: number, fleetId: string) => void;
  navigateToAboutCharges: () => void;
  cpf: string;
  setCpf: (value: string) => void;
  wantsCpf: boolean;
  onSwitchValueChange: (value: boolean) => void;
  canSubmit: boolean;
  quotes: Fare[] | undefined;
  selectedFare: Fare | undefined;
  onFareSelect: (fare: Fare) => void;
  total: number;
  navigateToAvailableFleets: () => void;
  navigateToCompleteProfile: () => void;
  navigateToSelectPayment: () => void;
  payMethod: PayableWith;
  onPayWithPix: () => void;
};

export default function ({
  order,
  selectedPaymentMethodId,
  isLoading,
  navigateToAddressComplete,
  navigateToFillPaymentInfo,
  navigateFleetDetail,
  navigateToTransportableItems,
  onSubmit,
  navigateToAboutCharges,
  navigateToPixPayment,
  cpf,
  setCpf,
  wantsCpf,
  onSwitchValueChange,
  canSubmit,
  quotes,
  selectedFare,
  onFareSelect,
  total,
  navigateToAvailableFleets,
  navigateToCompleteProfile,
  navigateToSelectPayment,
  payMethod,
  onPayWithPix,
}: Props) {
  // params
  const { origin, destination } = order ?? {};
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
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
  const pagerView = React.useRef<PagerView>(null);
  const originDescriptionRef = React.useRef<TextInput>(null);
  const destinationDescriptionRef = React.useRef<TextInput>(null);
  // helpers
  const showInstructionsWarning = (variant: 'origin' | 'destination') => {
    Keyboard.dismiss();
    if (variant === 'origin') {
      dispatch(
        showToast('Insira uma descrição curta para facilitar a retirada pelo entregador', 'error')
      );
    } else {
      dispatch(showToast('Insira uma descrição curta para agilizar a entrega', 'error'));
    }
  };
  const stepReady = (value: Step): boolean => {
    if (value === Step.Origin) return true; // always enabled
    if (value === Step.Destination) return Boolean(origin?.address.description); // only if origin is known and user has entered instructions
    if (value === Step.Confirmation) return Boolean(destination?.address.description) && !!order; // only if order has been created and user has entered instructions
    if (value === Step.ConfirmingOrder) return Boolean(selectedPaymentMethodId);
    return false; // should never happen
  };
  const setPage = (index: number): void => {
    if (stepReady(index)) {
      if (index === 1) {
        if (!originInstructions) {
          showInstructionsWarning('origin');
        } else pagerView?.current?.setPage(index);
      } else if (index === 2) {
        if (!destinationInstructions) {
          showInstructionsWarning('destination');
        } else pagerView?.current?.setPage(index);
      } else pagerView?.current?.setPage(index);
    }
  };
  const nextPage = (): void => setPage(step + 1);
  // handlers
  // when user press next button
  const nextStepHandler = async (): Promise<void> => {
    const nextStep: Step = step + 1;
    Keyboard.dismiss();
    if (stepReady(nextStep)) {
      if (step === Step.Origin) {
        if (!origin) return;
        if (!originInstructions) {
          showInstructionsWarning('origin');
          return;
        }
        api.order().updateOrder(order!.id, {
          origin: {
            ...origin,
            additionalInfo: originAdditionalInfo,
            intructions: originInstructions,
          },
        });
      } else if (step === Step.Destination) {
        if (!destination) return;
        if (!destinationInstructions) {
          showInstructionsWarning('destination');
          return;
        }
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
  const onPageScroll = (ev: NativeSyntheticEvent<PagerViewOnPageSelectedEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };
  // UI
  const isDeviceTaller = useTallerDevice();
  return (
    <View style={{ ...screens.default }}>
      <StepControl
        style={{ padding }}
        labels={[t('Retirada'), t('Entrega'), t('Confirmação')]}
        activeIndex={step}
        onChange={setPage}
      />

      <PagerView ref={pagerView} style={{ flex: 1 }} onPageScroll={onPageScroll}>
        {/* origin */}
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1 }}
            scrollIndicatorInsets={{ right: 1 }}
          >
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
              style={{ marginTop: 12 }}
              value={originAdditionalInfo}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
              onChangeText={(text) => setOriginAdditionalInfo(text)}
              editable={Boolean(origin)}
            />

            <DefaultInput
              ref={originDescriptionRef}
              style={{ marginTop: 12 }}
              value={originInstructions}
              title={t('Instruções para entrega')}
              placeholder={t('Quem irá atender o/a entregador/a, etc.')}
              onChangeText={(text) => setOriginInstructions(text)}
              editable={Boolean(origin)}
              blurOnSubmit
              multiline
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
                <Text style={{ ...texts.xs, marginLeft: 4, textDecorationLine: 'underline' }}>
                  {t('Sobre as encomendas')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ flex: 1 }} />
            <View style={{ paddingBottom: padding }}>
              <DefaultButton
                title={t('Confirmar local de retirada')}
                onPress={nextStepHandler}
                disabled={!stepReady(step + 1)}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>

        {/* destination */}
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1 }}
            scrollIndicatorInsets={{ right: 1 }}
          >
            <Pressable
              onPress={() => {
                if (!origin) return;
                navigateToAddressComplete('destination', destination ?? undefined);
              }}
            >
              <LabeledText
                title={t('Endereço de entrega')}
                placeholder={t('Endereço com número')}
                editable={Boolean(origin?.address.description)}
              >
                {destination?.address?.main}
              </LabeledText>
            </Pressable>

            <DefaultInput
              style={{ marginTop: 12 }}
              value={destinationAdditionalInfo}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
              onChangeText={(text) => setDestinationAdditionalInfo(text)}
              editable={Boolean(destination)}
            />

            <DefaultInput
              ref={destinationDescriptionRef}
              style={{ marginTop: 12 }}
              value={destinationInstructions}
              title={t('Instruções para entrega')}
              placeholder={t('Quem irá atender o/a entregador/a, etc.')}
              onChangeText={(text) => setDestinationInstructions(text)}
              blurOnSubmit
              multiline
              editable={Boolean(destination)}
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
                  {t('Saiba o que pode ser transportado')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ flex: 1 }} />
            <View style={{ paddingBottom: padding }}>
              <DefaultButton
                title={t('Confirmar local de entrega')}
                onPress={nextStepHandler}
                disabled={!stepReady(step + 1)}
                activityIndicator={
                  step === Step.Destination &&
                  Boolean(order?.destination?.address.description) &&
                  !order?.route
                }
              />
            </View>
          </KeyboardAwareScrollView>
        </View>

        {/* confirmation */}
        <View>
          {order?.route ? (
            <OrderSummary
              order={order!}
              showMap={!isDeviceTaller}
              onEditStep={setPage}
              payment={
                <OrderPayment
                  selectedPaymentMethodId={selectedPaymentMethodId}
                  onEditPaymentMethod={navigateToFillPaymentInfo}
                  isSubmitEnabled={canSubmit}
                  onSubmit={onSubmit}
                  activityIndicator={isLoading}
                  navigateToAboutCharges={navigateToAboutCharges}
                  orderId={order.id}
                  navigateToCompleteProfile={navigateToCompleteProfile}
                  navigateToSelectPayment={navigateToSelectPayment}
                  payMethod={payMethod}
                  onPayWithPix={onPayWithPix}
                />
              }
              orderFulfillment={
                <OrderAvailableFleets
                  order={order}
                  quotes={quotes}
                  selectedFare={selectedFare}
                  onFareSelect={onFareSelect}
                  onFleetSelect={navigateFleetDetail}
                  navigateToAvailableFleets={navigateToAvailableFleets}
                />
              }
              costBreakdown={<OrderCostBreakdown order={order} selectedFare={selectedFare!} />}
              totalCost={
                quotes === undefined ? (
                  <View style={screens.centered}>
                    <ActivityIndicator size="large" color={colors.green500} />
                  </View>
                ) : (
                  <OrderTotal
                    total={total}
                    switchValue={wantsCpf}
                    onSwitchValueChange={onSwitchValueChange}
                    cpf={cpf}
                    setCpf={setCpf}
                  />
                )
              }
            />
          ) : null}
        </View>
      </PagerView>
    </View>
  );
}
