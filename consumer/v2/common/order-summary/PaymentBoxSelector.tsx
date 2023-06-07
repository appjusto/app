import { Card } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  variant: 'card' | 'pix' | 'vr';
  selected: boolean;
  onSelectPayment: () => void;
  card?: Card;
};

export const PaymentBoxSelector = ({ variant, selected, onSelectPayment, card }: Props) => {
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
          marginBottom: padding,
        }}
      >
        <View>
          {card ? (
            <View>
              <Text style={{ ...texts.sm }}>
                {card.processor === 'iugu' ? t('Cartão de crédito') : t('VR')}
              </Text>
              <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 4 }}>
                {getCardDisplayNumber(card)}
              </Text>
            </View>
          ) : (
            <Text style={{ ...texts.sm, marginTop: 4 }}>
              {variant === 'card' ? t('Adicionar cartão') : ''}
              {variant === 'vr' ? t('Adicionar VR') : ''}
              {variant === 'pix' ? t('Pix') : ''}
            </Text>
          )}
        </View>
        <View>
          {variant === 'vr' ? (
            <RoundedText backgroundColor={colors.darkYellow}>{t('Novo!')}</RoundedText>
          ) : null}
          {variant === 'card' ? (
            <View>
              <Feather
                name="edit-3"
                size={12}
                style={{ ...borders.default, borderColor: colors.grey50, padding: 8 }}
              />
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
