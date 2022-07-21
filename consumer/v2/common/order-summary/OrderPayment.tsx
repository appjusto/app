import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { useIsPixEnabled } from '../../../../common/store/api/order/ui/useIsPixEnabled';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { getConsumer } from '../../../../common/store/consumer/selectors';
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
}: Props) => {
  // redux
  const consumer = useSelector(getConsumer)!;
  // helpers
  const payableWithPix = useIsPixEnabled();
  const { isProfileComplete, shouldVerifyPhone } = useProfileSummary();
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId);
  const canPlaceOrder = isProfileComplete && !shouldVerifyPhone;
  console.log('canPlaceOrder', canPlaceOrder);
  return (
    <PaddedView>
      {Boolean(selectedPaymentMethod) ? (
        <View style={{ marginBottom: halfPadding }}>
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
      {(!isProfileComplete || shouldVerifyPhone) && !activityIndicator ? (
        <DefaultButton
          variant="secondary"
          title={t('Completar cadastro')}
          style={{ marginVertical: padding }}
          onPress={navigateToCompleteProfile}
        />
      ) : null}
      {canPlaceOrder && !activityIndicator ? (
        <View>
          <DefaultButton
            variant="primary"
            title={t('Confirmar pedido')}
            style={{ marginTop: padding }}
            onPress={onSubmit}
          />
          {payableWithPix ? (
            <DefaultButton
              variant="secondary"
              title={t('Quero pagar com Pix')}
              style={{ marginTop: padding }}
              onPress={onPayWithPix}
            />
          ) : null}
        </View>
      ) : (
        <DefaultButton
          variant="secondary"
          title={t('Escolher forma de pagamento')}
          style={{ marginVertical: padding }}
          onPress={navigateToSelectPayment}
        />
      )}
    </PaddedView>
  );
};
