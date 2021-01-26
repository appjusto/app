import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

interface Props {
  selectedPaymentMethodId?: string;
  isSubmitEnabled: boolean;
  onEditPaymentMethod: () => void;
  onSubmit: () => void;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  onEditPaymentMethod,
  onSubmit,
}: Props) => {
  const consumer = useSelector(getConsumer)!;
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId);
  return (
    <PaddedView>
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
              <Text style={{ ...texts.medium }}>{t('Forma de pagamento')}</Text>
              <Image style={{ width: 32, height: 32 }} source={icons.edit} />
            </View>
            <Text style={{ ...texts.default, color: colors.darkGrey }}>
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
      />
    </PaddedView>
  );
};
