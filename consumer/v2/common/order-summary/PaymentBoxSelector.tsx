import { Card } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  variant: 'pix' | 'card';
  selected: boolean;
  onSelectPayment: () => void;
  creditCard?: Card;
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
              {creditCard ? (
                <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 4 }}>
                  {t('...')} {getCardDisplayNumber(creditCard)}
                </Text>
              ) : (
                <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 4 }}>
                  {t('Adicionar cartão')}
                </Text>
              )}
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
