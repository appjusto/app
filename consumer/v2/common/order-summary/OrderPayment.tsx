import { PayableWith } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { useCards } from '../../../../common/store/api/consumer/cards/useCards';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useAcceptedPaymentMethods } from '../../../../common/store/api/platform/hooks/useAcceptedPaymentMethods';
import { colors, doublePadding, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { useCheckoutIssues } from '../../food/restaurant/checkout/useCheckoutIssues';

interface Props {
  selectedPaymentMethodId?: string | null;
  isSubmitEnabled: boolean;
  activityIndicator: boolean;
  onSubmit: () => void;
  navigateToCompleteProfile: () => void;
  navigateToSelectPayment: () => void;
  onPayWithPix: () => void;
  payMethod: PayableWith;
  orderId: string;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  activityIndicator,
  onSubmit,
  onPayWithPix,
  navigateToCompleteProfile,
  navigateToSelectPayment,
  payMethod,
  orderId,
}: Props) => {
  // context
  const order = useObserveOrder(orderId);
  const issues = useCheckoutIssues(payMethod, selectedPaymentMethodId);
  const cards = useCards();
  const selectedPaymentMethod = cards?.find((card) => card.id === selectedPaymentMethodId);
  const pixEnabled = useAcceptedPaymentMethods().includes('pix');
  const canPlaceOrder = issues.length === 0 && !activityIndicator;
  console.log(issues, selectedPaymentMethod, payMethod, pixEnabled, canPlaceOrder, order);
  if (!order) return null;
  return (
    <View style={{ backgroundColor: colors.white, paddingBottom: doublePadding }}>
      {payMethod !== 'pix' &&
      selectedPaymentMethod &&
      !issues.includes('unsupported-payment-method') ? (
        <View>
          <SingleHeader title={t('Forma de pagamento')} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: padding,
            }}
          >
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {`${
                selectedPaymentMethod.processor === 'iugu' ? t('Cartão de crédito') : t('VR')
              }: ${getCardDisplayNumber(selectedPaymentMethod)}`}
            </Text>
            <TouchableOpacity onPress={navigateToSelectPayment}>
              <Text style={{ ...texts.md, color: colors.green600 }}>{t('Trocar')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {payMethod === 'pix' ? (
        <View>
          <SingleHeader title={t('Forma de pagamento')} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: padding,
              marginBottom: padding,
            }}
          >
            <Text style={{ ...texts.md }}>{t('Pagar com Pix')}</Text>
            <TouchableOpacity onPress={navigateToSelectPayment}>
              <Text style={{ ...texts.md, color: colors.green600 }}>{t('Trocar')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <View style={{ paddingHorizontal: padding, backgroundColor: colors.white }}>
        {issues.includes('profile-incomplete') || issues.includes('should-verify-phone') ? (
          <DefaultButton
            variant="secondary"
            title={t('Completar cadastro')}
            onPress={navigateToCompleteProfile}
          />
        ) : null}
        {issues.includes('invalid-payment-method') ||
        issues.includes('unsupported-payment-method') ? (
          <DefaultButton
            variant="secondary"
            title={t('Escolher forma de pagamento')}
            onPress={navigateToSelectPayment}
          />
        ) : null}
        {issues.includes('schedule-required') || issues.includes('invalid-route') ? (
          <PaddedView
            half
            style={{
              backgroundColor: colors.darkYellow,
              borderRadius: halfPadding,
              marginTop: halfPadding,
            }}
          >
            <Text style={{ ...texts.sm }}>
              {issues.includes('schedule-required')
                ? t('Você precisa agendar um horário antes de fazer o pedido.')
                : order.route?.issue ??
                  t(
                    'Problema para calcular a rota de entrega. Altere o endereço e tente novamente.'
                  )}
            </Text>
          </PaddedView>
        ) : null}

        {canPlaceOrder || activityIndicator ? (
          <DefaultButton
            variant="primary"
            title={t('Confirmar pedido')}
            style={{ marginTop: padding }}
            onPress={onSubmit}
            activityIndicator={activityIndicator}
            disabled={!isSubmitEnabled}
          />
        ) : null}
        {pixEnabled && payMethod !== 'pix' ? (
          <DefaultButton
            variant="secondary"
            title={t('Quero pagar com Pix')}
            style={{ marginTop: padding }}
            onPress={onPayWithPix}
          />
        ) : null}
      </View>
    </View>
  );
};
