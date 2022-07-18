import { IuguCustomerPaymentMethod } from '@appjusto/types/payment/iugu';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  variant: 'pix' | 'card';
  selected: boolean;
  onSelectPayment: () => void;
  creditCard?: IuguCustomerPaymentMethod;
};

export const PaymentBoxSelector = ({ variant, selected, onSelectPayment, creditCard }: Props) => {
  return (
    <TouchableOpacity onPress={onSelectPayment}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding,
          height: 86,
          width: '100%',
          ...borders.default,
          backgroundColor: selected ? colors.white : colors.grey50,
          borderColor: selected ? colors.black : colors.grey500,
        }}
      >
        <View>
          {variant === 'pix' ? (
            <Text style={{ ...texts.sm }}>{t('Pix')}</Text>
          ) : (
            <View>
              <Text style={{ ...texts.sm }}>{t('Cartão de crédito')}</Text>
              <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 4 }}>
                {t('...')} {creditCard.data.display_number}
              </Text>
            </View>
          )}
        </View>
        <View>
          {variant === 'pix' ? (
            <RoundedText backgroundColor={colors.darkYellow}>{t('Novo!')}</RoundedText>
          ) : (
            <View>
              <Feather
                name="edit-3"
                size={12}
                style={{ ...borders.default, borderColor: colors.grey50, padding: 8 }}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
