import { ChatMessageUser } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import {
  unreadMessages,
  useObserveOrderChat,
} from '../../../store/api/order/hooks/useObserveOrderChat';
import { getUser } from '../../../store/user/selectors';
import { borders, colors, halfPadding, texts } from '../../../styles';

interface Props {
  orderId: string;
  variant?: 'standalone' | 'coupled';
  onOpenChat: (from: ChatMessageUser) => void;
}

export const MessagesCard = ({ orderId, variant = 'standalone', onOpenChat }: Props) => {
  // redux
  const user = useSelector(getUser)!;
  // state
  const chat = useObserveOrderChat(orderId, user.uid);
  const unread = unreadMessages(chat, user.uid);
  if (unread.length === 0) return null;
  return (
    <TouchableOpacity onPress={() => onOpenChat(unread[0].from)}>
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
            {t('Você tem')} {unread.length} {t('novas mensagens.')}
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
