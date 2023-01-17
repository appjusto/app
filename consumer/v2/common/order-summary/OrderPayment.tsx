import { PayableWith } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useIsPixEnabled } from '../../../../common/store/api/order/ui/useIsPixEnabled';
import { useP2PPix } from '../../../../common/store/api/order/ui/useP2PPix';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { colors, doublePadding, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

interface Props {
  selectedPaymentMethodId?: string;
  isSubmitEnabled: boolean;
  activityIndicator: boolean;
  onEditPaymentMethod: () => void;
  onSubmit: () => void;
  navigateToCompleteProfile: () => void;
  navigateToSelectPayment: () => void;
  onPayWithPix: () => void;
  payMethod: PayableWith;
  orderId: string;
  showWarning?: boolean;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  activityIndicator,
  onEditPaymentMethod,
  onSubmit,
  onPayWithPix,
  navigateToCompleteProfile,
  navigateToSelectPayment,
  payMethod,
  orderId,
  showWarning,
}: Props) => {
  // context
  const order = useObserveOrder(orderId);
  // redux
  const consumer = useSelector(getConsumer)!;
  // helpers
  const foodPayableWithPix = useIsPixEnabled();
  const p2pPayableWithPix = useP2PPix();
  const { isProfileComplete, shouldVerifyPhone } = useProfileSummary();
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId); // only for credit cards
  const canPlaceOrder = isProfileComplete && !shouldVerifyPhone;
  if (!order) return null;
  return (
    <View style={{ backgroundColor: colors.white, paddingBottom: doublePadding }}>
      {Boolean(selectedPaymentMethod) && payMethod === 'credit_card' ? (
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
              {`${t('Cartão de crédito')}: ${selectedPaymentMethod!.data.display_number}`}
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
        {showWarning && canPlaceOrder ? (
          <PaddedView
            half
            style={{ backgroundColor: colors.darkYellow, borderRadius: halfPadding }}
          >
            <Text style={{ ...texts.sm }}>
              {t('Você precisa agendar um horário antes de fazer o pedido')}
            </Text>
          </PaddedView>
        ) : null}
        {!canPlaceOrder && !activityIndicator ? (
          <DefaultButton
            variant="secondary"
            title={t('Completar cadastro')}
            onPress={navigateToCompleteProfile}
          />
        ) : null}
        {canPlaceOrder && !selectedPaymentMethod && payMethod !== 'pix' ? (
          <DefaultButton
            variant="secondary"
            title={t('Escolher forma de pagamento')}
            onPress={navigateToSelectPayment}
          />
        ) : null}
        {canPlaceOrder &&
        (payMethod === 'pix' || (payMethod === 'credit_card' && selectedPaymentMethod)) ? (
          <DefaultButton
            variant="primary"
            title={t('Confirmar pedido')}
            style={{ marginTop: padding }}
            onPress={onSubmit}
            activityIndicator={activityIndicator}
            disabled={!isSubmitEnabled}
          />
        ) : null}
        {canPlaceOrder &&
        !activityIndicator &&
        (foodPayableWithPix || p2pPayableWithPix) &&
        payMethod !== 'pix' ? (
          <DefaultButton
            variant="secondary"
            title={t('Quero pagar com Pix')}
            style={{ marginTop: padding }}
            onPress={onPayWithPix}
            disabled={!isSubmitEnabled}
          >
            <RoundedText backgroundColor={colors.yellow}>{t('Novo!')}</RoundedText>
          </DefaultButton>
        ) : null}
      </View>
    </View>
  );
};
