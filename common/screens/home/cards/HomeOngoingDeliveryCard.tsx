import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import ShowIf from '../../../components/views/ShowIf';
import {
  getLastReadMessage,
  getOrderChat,
  getOrderChatUnreadCount,
} from '../../../store/order/selectors';
import { borders, colors, padding, texts } from '../../../styles';
import { MessagesCard } from './MessagesCard';

type Props = {
  order: WithId<Order>;
  onSelect: (order: WithId<Order>, openChat: boolean) => void;
};

export default function ({ order, onSelect }: Props) {
  // app state
  const messages = useSelector(getOrderChat)(order.id);
  const lastReadMessage = useSelector(getLastReadMessage)(order.id);
  const unreadCount = getOrderChatUnreadCount(messages, lastReadMessage);

  // UI
  let detail = '';
  if (order.dispatchingState === 'going-pickup') {
    detail = `${t('À caminho de')} ${order.origin.address.main}`;
  } else if (order.dispatchingState === 'arrived-pickup') {
    detail = order.origin.intructions ?? 'Aguardando retirada';
  } else if (order.dispatchingState === 'going-destination') {
    detail = `${t('À caminho de')} ${order.destination.address.main}`;
  } else if (order.dispatchingState === 'arrived-destination') {
    detail = order.destination.intructions ?? 'Aguardando entrega';
  }
  return (
    <TouchableOpacity onPress={() => onSelect(order, false)}>
      <View style={{ ...borders.default }}>
        <View>
          <ShowIf test={unreadCount > 0}>
            {() => <MessagesCard unreadCount={unreadCount} onPress={() => onSelect(order, true)} />}
          </ShowIf>
          <PaddedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.yellow,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
            half
          >
            <Image source={icons.requests} />
            <View style={{ marginLeft: padding }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ ...texts.default }}>{t('Corrida em andamento')}</Text>
                  <Text
                    style={{
                      ...texts.small,
                      color: colors.darkGrey,
                      flexWrap: 'wrap',
                      maxWidth: '85%',
                    }}
                    numberOfLines={2}
                  >
                    {detail}
                  </Text>
                </View>
              </View>
            </View>
          </PaddedView>
        </View>
      </View>
    </TouchableOpacity>
  );
}
