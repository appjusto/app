import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

interface Props {
  selectedPaymentMethodId?: string;
  isSubmitEnabled: boolean;
  onEditPaymentMethod: () => void;
  onSubmit: () => void;
  activityIndicator: boolean;
  navigateToPixPayment: () => void;
  navigateToAboutCharges: () => void;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  onEditPaymentMethod,
  onSubmit,
  activityIndicator,
  navigateToPixPayment,
  navigateToAboutCharges,
}: Props) => {
  const consumer = useSelector(getConsumer)!;
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId);
  return (
    <View>
      {/* <View style={{ marginTop: padding }}>
        <SingleHeader title={t('Forma de pagamento')} />
      </View> */}
      <PaddedView>
        {/* {Boolean(!selectedPaymentMethod) && (
          <View style={{ marginBottom: padding }}>
            <PixCard navigateToPixPayment={navigateToPixPayment} />
          </View>
        )} */}
        {Boolean(selectedPaymentMethod) && (
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
                  {`${t('Cartão de crédito')}: XXXX-XXXX-XXXX-${
                    selectedPaymentMethod!.data.last_digits
                  }`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: halfPadding }} onPress={navigateToAboutCharges}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="info" size={14} />
                <Text
                  style={{ ...texts.xs, marginLeft: halfPadding, textDecorationLine: 'underline' }}
                >
                  {t('O valor total será dividido em duas cobranças')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {Boolean(!selectedPaymentMethod) && (
          <DefaultButton
            title={t('Escolher uma forma de pagamento')}
            onPress={onEditPaymentMethod}
            secondary
            style={{ marginTop: padding }}
          />
        )}
        {Boolean(selectedPaymentMethod) && (
          <DefaultButton
            style={{ marginVertical: padding }}
            title={t('Confirmar pedido')}
            onPress={onSubmit}
            disabled={!isSubmitEnabled}
            activityIndicator={activityIndicator}
          />
        )}
        {/* {Boolean(selectedPaymentMethod) && (
          <DefaultButton
            secondary
            title={t('Quero pagar com Pix')}
            style={{ marginBottom: padding }}
            onPress={navigateToPixPayment}
          >
            <RoundedText backgroundColor={colors.darkYellow} style={{ right: -64 }}>
              {t('Novo!')}
            </RoundedText>
          </DefaultButton>
        )} */}
      </PaddedView>
    </View>
  );
};
