import { Card, PayableWith, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { getCardType } from '../../../../common/store/api/consumer/cards/getCardType';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useAcceptedPaymentMethods } from '../../../../common/store/api/platform/hooks/useAcceptedPaymentMethods';
import { colors, doublePadding, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { useCheckoutIssues } from '../../food/restaurant/checkout/useCheckoutIssues';

interface Props {
  // selectedPaymentMethodId?: string | null;
  isSubmitEnabled: boolean;
  activityIndicator: boolean;
  onSubmit: () => void;
  navigateToCompleteProfile: () => void;
  navigateToSelectPayment: () => void;
  onPayWithPix: () => void;
  payMethod: PayableWith;
  card?: WithId<Card>;
  orderId: string;
}

export const OrderPayment = ({
  isSubmitEnabled,
  activityIndicator,
  onSubmit,
  onPayWithPix,
  navigateToCompleteProfile,
  navigateToSelectPayment,
  payMethod,
  card,
  orderId,
}: Props) => {
  // context
  const order = useObserveOrder(orderId);
  const issues = useCheckoutIssues(payMethod, card);
  const acceptedPaymentMethods = useAcceptedPaymentMethods();
  const pixEnabled = acceptedPaymentMethods.includes('pix');
  const canPlaceOrder = issues.length === 0 && !activityIndicator;
  const profileIncomplete =
    issues.includes('profile-incomplete') || issues.includes('should-verify-phone');
  const invalidPayment =
    issues.includes('invalid-payment-method') || issues.includes('unsupported-payment-method');
  if (!order) return null;
  return (
    <View style={{ backgroundColor: colors.white, paddingBottom: doublePadding }}>
      {payMethod !== 'pix' && card && !issues.includes('unsupported-payment-method') ? (
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
              {`${getCardType(card)}: ${getCardDisplayNumber(card)}`}
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
        {profileIncomplete ? (
          <DefaultButton
            variant="secondary"
            title={t('Completar cadastro')}
            onPress={navigateToCompleteProfile}
          />
        ) : null}
        {invalidPayment && !profileIncomplete ? (
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
