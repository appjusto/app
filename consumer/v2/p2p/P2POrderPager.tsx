import { Order, Place, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import PagerView, { ViewPagerOnPageScrollEventData } from 'react-native-pager-view';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { StepControl } from '../../../common/components/controls/step-control/StepControl';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../common/components/texts/LabeledText';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderSummary } from '../common/order-summary/OrderSummary';
import { Step } from './types';

type Props = {
  order: WithId<Order> | undefined;
  selectedPaymentMethodId?: string;
  isLoading: boolean;
  navigateToAddressComplete: (returnParam: string, value?: Place) => void;
  navigateToFillPaymentInfo: () => void;
  navigateFleetDetail: (fleetId: string) => void;
  navigateToTransportableItems: () => void;
  placeOrder: (fleetId: string) => Promise<void>;
  navigateToPixPayment: (total: number, fleetId: string) => void;
  navigateToAboutCharges: () => void;
  cpf: string;
  setCpf: (value: string) => void;
  wantsCpf: boolean;
  onSwitchValueChange: (value: boolean) => void;
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
  navigateToAboutCharges,
  cpf,
  setCpf,
  wantsCpf,
  onSwitchValueChange,
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
  const pagerView = React.useRef<PagerView>(null);
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
      pagerView?.current?.setPage(index);
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
  // const verticalPadding = isDeviceTaller ? doublePadding : padding;
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
            keyboardShouldPersistTaps="always"
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
              style={{ marginTop: 12 }}
              value={originInstructions}
              title={t('Instruções para entrega')}
              placeholder={t('Quem irá atender o/a entregador/a, etc.')}
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
            keyboardShouldPersistTaps="always"
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
              style={{ marginTop: 12 }}
              value={destinationInstructions}
              title={t('Instruções para retirada')}
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
              selectedPaymentMethodId={selectedPaymentMethodId}
              activityIndicator={isLoading}
              waiting={isLoading}
              showMap={!isDeviceTaller}
              onEditStep={setPage}
              placeOrder={placeOrder}
              navigateToFillPaymentInfo={navigateToFillPaymentInfo}
              navigateFleetDetail={navigateFleetDetail}
              navigateToPixPayment={navigateToPixPayment}
              navigateToAboutCharges={navigateToAboutCharges}
              wantsCpf={wantsCpf}
              onSwitchValueChange={onSwitchValueChange}
              cpf={cpf}
              setCpf={(text) => setCpf(text)}
            />
          ) : null}
        </View>
      </PagerView>
    </View>
  );
}
