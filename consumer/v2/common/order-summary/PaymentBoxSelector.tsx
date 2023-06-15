import { Card } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PayableWith } from '../../../../../types';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { getCardDisplayNumber } from '../../../../common/store/api/consumer/cards/getCardDisplayNumber';
import { getCardType } from '../../../../common/store/api/consumer/cards/getCardType';
import { borders, colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  variant: PayableWith;
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
              <Text style={{ ...texts.sm }}>{getCardType(card)}</Text>
              <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 4 }}>
                {getCardDisplayNumber(card)}
              </Text>
            </View>
          ) : (
            <Text style={{ ...texts.sm, marginTop: 4 }}>
              {variant === 'credit_card' ? t('Adicionar cartão') : ''}
              {variant === 'vr-alimentação' ? t('Adicionar VR Alimentação') : ''}
              {variant === 'vr-refeição' ? t('Adicionar VR Refeição') : ''}
              {variant === 'pix' ? t('Pix') : ''}
            </Text>
          )}
        </View>
        <View>
          {!card && (variant === 'vr-alimentação' || variant === 'vr-refeição') ? (
            <RoundedText backgroundColor={colors.darkYellow}>{t('Novo!')}</RoundedText>
          ) : null}
          {variant === 'credit_card' ? (
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
