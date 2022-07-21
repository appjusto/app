import { PayableWith } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { useIsPixEnabled } from '../../../../common/store/api/order/ui/useIsPixEnabled';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { useContextActiveOrder } from '../../../../common/store/context/order';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

interface Props {
  selectedPaymentMethodId?: string;
  isSubmitEnabled: boolean;
  activityIndicator: boolean;
  onEditPaymentMethod: () => void;
  onSubmit: () => void;
  navigateToAboutCharges: () => void;
  navigateToCompleteProfile: () => void;
  navigateToSelectPayment: () => void;
  onPayWithPix: () => void;
  payMethod: PayableWith;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  activityIndicator,
  onEditPaymentMethod,
  onSubmit,
  navigateToAboutCharges,
  onPayWithPix,
  navigateToCompleteProfile,
  navigateToSelectPayment,
  payMethod,
}: Props) => {
  // context
  const order = useContextActiveOrder();
  // redux
  const consumer = useSelector(getConsumer)!;
  // helpers
  const payableWithPix = useIsPixEnabled();
  const { isProfileComplete, shouldVerifyPhone } = useProfileSummary();
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId); // only for credit cards
  const canPlaceOrder = isProfileComplete && !shouldVerifyPhone;
  if (!order) return null;
  return (
    <View style={{ backgroundColor: colors.white }}>
      {Boolean(selectedPaymentMethod) && payMethod === 'credit_card' ? (
        <View style={{ marginVertical: padding, paddingHorizontal: padding }}>
          <TouchableOpacity onPress={onEditPaymentMethod}>
            <View style={{ marginBottom: halfPadding }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ ...texts.md }}>{t('Forma de pagamento')}</Text>
                <Feather
                  name="edit-3"
                  size={12}
                  style={{ ...borders.default, borderColor: colors.grey50, padding: 8 }}
                />
              </View>
              <Text style={{ ...texts.sm, color: colors.grey700 }}>
                {`${t('Cartão de crédito')}: ${selectedPaymentMethod!.data.display_number}`}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: halfPadding }} onPress={navigateToAboutCharges}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="info" size={14} />
              <Text
                style={{ ...texts.xs, marginLeft: halfPadding, textDecorationLine: 'underline' }}
              >
                {t('O valor total pode ser dividido em duas cobranças. Clique para saber mais')}
              </Text>
            </View>
          </TouchableOpacity>
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
        {!canPlaceOrder && !activityIndicator ? (
          <DefaultButton
            variant="secondary"
            title={t('Completar cadastro')}
            // style={{ marginVertical: padding }}
            onPress={navigateToCompleteProfile}
          />
        ) : null}
        {canPlaceOrder && !selectedPaymentMethod ? (
          <DefaultButton
            variant="secondary"
            title={t('Escolher forma de pagamento')}
            // style={{ marginVertical: padding }}
            onPress={navigateToSelectPayment}
          />
        ) : null}
        {canPlaceOrder && selectedPaymentMethod && !activityIndicator ? (
          <DefaultButton
            variant="primary"
            title={t('Confirmar pedido')}
            // style={{ marginTop: padding }}
            onPress={onSubmit}
          />
        ) : null}
        {canPlaceOrder && !activityIndicator && payableWithPix && payMethod !== 'pix' ? (
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
