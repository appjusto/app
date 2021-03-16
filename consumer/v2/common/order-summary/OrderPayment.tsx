import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { PixCard } from '../PixCard';

interface Props {
  selectedPaymentMethodId?: string;
  isSubmitEnabled: boolean;
  onEditPaymentMethod: () => void;
  onSubmit: () => void;
  activityIndicator: boolean;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  onEditPaymentMethod,
  onSubmit,
  activityIndicator,
}: Props) => {
  const consumer = useSelector(getConsumer)!;
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId);
  return (
    <PaddedView>
      <View style={{ marginBottom: padding }}>
        <PixCard />
      </View>
      {Boolean(selectedPaymentMethod) && (
        <TouchableOpacity onPress={onEditPaymentMethod}>
          <PaddedView>
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
          </PaddedView>
        </TouchableOpacity>
      )}

      {!selectedPaymentMethod && (
        <DefaultButton
          title={t('Finalizar cadastro e adicionar pagamento')}
          onPress={onEditPaymentMethod}
          secondary
        />
      )}

      <DefaultButton
        style={{ marginTop: padding }}
        title={t('Confirmar pedido')}
        onPress={onSubmit}
        disabled={!isSubmitEnabled}
        activityIndicator={activityIndicator}
      />
    </PaddedView>
  );
};
