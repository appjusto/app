import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ChatMessageUser, Order, WithId } from '../../../../types';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconMessageReceived } from '../../../common/icons/icon-message-received';
import {
  unreadMessages,
  useObserveOrderChat,
} from '../../../common/store/api/order/hooks/useObserveOrderChat';
import { getUser } from '../../../common/store/user/selectors';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
  navigateToReportIssue: () => void;
  navigateToConfirmCancel: () => void;
  onMessageReceived: (from: ChatMessageUser) => void;
};

export const OngoingActions = ({
  order,
  navigateToReportIssue,
  navigateToConfirmCancel,
  onMessageReceived,
}: Props) => {
  // redux
  const user = useSelector(getUser)!;
  // state
  const chat = useObserveOrderChat(order.id, user.uid);
  const unread = unreadMessages(chat, user.uid);
  const title = (() => {
    if (unread[0].from.agent === 'business') {
      return t('Nova mensagem do restaurante');
    } else {
      return t('Nova mensagem do entregador');
    }
  })();
  const subtitle = (() => {
    if (unread[0].from.agent === 'business') {
      return t('Olá, precisamos falar com você');
    } else {
      return t('Olá, preciso falar com você');
    }
  })();
  return (
    <PaddedView style={{ flex: 1 }}>
      <Text style={[texts.xs, { color: colors.green600 }]}>{t('Entregar em')}</Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: padding,
        }}
      >
        <View>
          <Text style={[texts.xs]} numberOfLines={2}>
            {order.destination?.address.main ?? ''}
          </Text>
          {order.destination?.additionalInfo ? (
            <View>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {order.destination?.additionalInfo}
              </Text>
            </View>
          ) : null}
          {order.destination?.intructions ? (
            <View>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {order.destination?.intructions}
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          <TouchableOpacity onPress={() => null}>
            <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Alterar')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {unread.length > 0 ? (
        <TouchableOpacity onPress={() => onMessageReceived(unread[0].from)}>
          <PaddedView
            style={{
              ...borders.default,
              backgroundColor: colors.yellow,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <IconMessageReceived />
            <View style={{ marginLeft: padding }}>
              <Text style={{ ...texts.sm }}>{title}</Text>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>{subtitle}</Text>
            </View>
          </PaddedView>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ width: '49%' }}>
            <DefaultButton
              title={t('Relatar problema')}
              secondary
              onPress={navigateToReportIssue}
            />
          </View>
          <View style={{ width: '49%' }}>
            <DefaultButton
              title={t('Cancelar pedido')}
              secondary
              onPress={navigateToConfirmCancel}
            />
          </View>
        </View>
      )}
    </PaddedView>
  );
};
