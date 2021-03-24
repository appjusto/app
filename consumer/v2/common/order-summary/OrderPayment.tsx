import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { PixCard } from '../PixCard';

interface Props {
  selectedPaymentMethodId?: string;
  isSubmitEnabled: boolean;
  onEditPaymentMethod: () => void;
  onSubmit: () => void;
  activityIndicator: boolean;
  navigateToPixPayment: () => void;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  onEditPaymentMethod,
  onSubmit,
  activityIndicator,
  navigateToPixPayment,
}: Props) => {
  const consumer = useSelector(getConsumer)!;
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId);
  return (
    <View>
      <SingleHeader title={t('Forma de pagamento')} />
      <PaddedView>
        {Boolean(!selectedPaymentMethod) && (
          <View style={{ marginBottom: padding }}>
            <PixCard navigateToPixPayment={navigateToPixPayment} />
          </View>
        )}
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
                  {`${t('Cartão de crédito')}: **** ${selectedPaymentMethod!.data.last_digits}`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: halfPadding }} onPress={() => null}>
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
            title={t('Escolher outra forma de pagamento')}
            onPress={onEditPaymentMethod}
            secondary
          />
        )}

        <DefaultButton
          style={{ marginVertical: padding }}
          title={t('Confirmar pedido')}
          onPress={onSubmit}
          disabled={!isSubmitEnabled}
          activityIndicator={activityIndicator}
        />
        {Boolean(selectedPaymentMethod) && (
          <DefaultButton
            secondary
            title={t('Quero pagar com Pix')}
            style={{ marginBottom: padding }}
            onPress={navigateToPixPayment}
            newFeature
          />
        )}
      </PaddedView>
    </View>
  );
};
