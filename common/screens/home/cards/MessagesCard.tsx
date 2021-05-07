import { PushMessage } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import { borders, colors, halfPadding, texts } from '../../../styles';

interface Props {
  orderId: string;
  variant?: 'standalone' | 'coupled';
  onPress: () => void;
}

export const MessagesCard = ({ orderId, variant = 'standalone', onPress }: Props) => {
  const chatQuery = useQuery<PushMessage[]>(['notifications', 'order-chat'], () => []);
  const unreadCount = (chatQuery.data ?? []).filter((m) => m.data.orderId === orderId && !m.read)
    .length;
  if (unreadCount === 0) return null;
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...(variant === 'standalone'
            ? borders.default
            : {
                borderBottomColor: colors.grey700,
                borderBottomWidth: 1,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }),
          backgroundColor: colors.white,
        }}
      >
        <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="message-circle" size={18} />
          <Text style={{ ...texts.xs, marginLeft: halfPadding }}>
            {t('Você tem')} {unreadCount} {t('novas mensagens.')}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ ...texts.xs, ...texts.bold, color: colors.green600 }}>
            {t('Abrir chat')}
          </Text>
        </PaddedView>
      </View>
    </TouchableOpacity>
  );
};
