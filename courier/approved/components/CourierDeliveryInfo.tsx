import { Feather } from '@expo/vector-icons';
import { Order, WithId } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RoundedText from '../../../common/components/texts/RoundedText';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
  onChat: () => void;
  onProblem: () => void;
};

export const CourierDeliveryInfo = ({ order, onChat, onProblem }: Props) => {
  return (
    <View>
      <Text style={[texts.xs, { color: colors.green600 }]}>{t('Pedido de')}</Text>
      <Text style={[texts.md]}>
        {!isEmpty(order.consumer.name) ? order.consumer.name : t('Cliente')}
      </Text>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: padding }}
      >
        <TouchableOpacity onPress={onChat}>
          <View style={{ marginTop: halfPadding }}>
            <RoundedText
              leftIcon={<Feather name="message-circle" size={12} style={{ marginRight: 6 }} />}
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
                <Feather name="info" size={12} color={colors.red} style={{ marginRight: 6 }} />
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