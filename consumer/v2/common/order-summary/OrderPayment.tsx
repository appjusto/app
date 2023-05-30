import { PayableWith } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { useCards } from '../../../../common/store/api/consumer/cards/useCards';
import { useObserveOrder } from '../../../../common/store/api/order/hooks/useObserveOrder';
import { useIsPixEnabled } from '../../../../common/store/api/order/ui/useIsPixEnabled';
import { useP2PPix } from '../../../../common/store/api/order/ui/useP2PPix';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { colors, doublePadding, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

interface Props {
  selectedPaymentMethodId?: string | null;
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
  const cards = useCards();
  const selectedPaymentMethod = cards?.find((card) => card.id === selectedPaymentMethodId);
  // helpers
  const foodPayableWithPix = useIsPixEnabled();
  const p2pPayableWithPix = useP2PPix();
  const { isProfileComplete, shouldVerifyPhone } = useProfileSummary();
  const canPlaceOrder = isProfileComplete && !shouldVerifyPhone;
  if (!order) return null;
  return (
    <View style={{ backgroundColor: colors.white, paddingBottom: doublePadding }}>
      {selectedPaymentMethod && payMethod === 'credit_card' ? (
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
              {`${t('Cartão de crédito')}: ${getCardDisplayNumber(selectedPaymentMethod)}`}
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
            style={{
              backgroundColor: colors.darkYellow,
              borderRadius: halfPadding,
              marginTop: halfPadding,
            }}
          >
            <Text style={{ ...texts.sm }}>
              {t('Você precisa agendar um horário antes de fazer o pedido.')}
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
          >
            <RoundedText backgroundColor={colors.yellow}>{t('Novo!')}</RoundedText>
          </DefaultButton>
        ) : null}
      </View>
    </View>
  );
};
