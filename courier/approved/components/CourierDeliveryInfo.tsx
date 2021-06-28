import { Order, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RoundedText from '../../../common/components/texts/RoundedText';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
  onChat: () => void;
  onProblem: () => void;
  delivering?: boolean;
};

export const CourierDeliveryInfo = ({ order, onChat, onProblem, delivering }: Props) => {
  return order.type === 'food' && order.dispatchingState === 'going-pickup' ? null : (
    <View style={{ marginHorizontal: padding }}>
      <Text style={[texts.xs, { color: colors.green600 }]}>{t('Pedido de')}</Text>
      <Text style={delivering ? { ...texts.lg } : { ...texts.md }}>
        {!isEmpty(order.consumer.name) ? order.consumer.name : t('Cliente')}
      </Text>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: padding }}
      >
        <TouchableOpacity onPress={onChat}>
          <View style={{ marginTop: halfPadding }}>
            <RoundedText
              leftIcon={<Feather name="message-circle" size={12} style={{ marginRight: 4 }} />}
            >
              {t('Iniciar chat')}
            </RoundedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onProblem}>
          <View style={{ marginTop: halfPadding }}>
            <RoundedText
              color={colors.red}
              leftIcon={
                <Feather name="info" size={12} color={colors.red} style={{ marginRight: 4 }} />
              }
            >
              {t('Tive um problema')}
            </RoundedText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
