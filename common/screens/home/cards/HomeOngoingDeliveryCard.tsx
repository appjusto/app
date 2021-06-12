import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import { IconMotocycleCentered } from '../../../icons/icon-motocycle-centered';
import { IconRequest } from '../../../icons/icon-requests';
import { borders, colors, padding, texts } from '../../../styles';
import { MessagesCard } from './MessagesCard';

type Props = {
  order: WithId<Order>;
  onOpenChat: (order: WithId<Order>, message?: ChatMessageUser) => void;
};

export default function ({ order, onOpenChat }: Props) {
  const { dispatchingStatus, dispatchingState } = order;
  // UI
  let title = '';
  if (order.status === 'confirming' || order.status === 'quote') {
    title = t('Aguarde enquanto criamos seu pedido...');
  } else if (order.status === 'confirmed') {
    if (order.dispatchingStatus === 'matching') {
      title = t('Procurando entregadores próximos:');
    } else {
      title = t('Aguarde enquanto criamos o seu pedido...');
    }
  } else if (order.status === 'preparing') {
    title = t('Pedido em preparo no estabelecimento');
  } else if (order.status === 'ready') {
    if (order.dispatchingStatus === 'matching') {
      title = t('Procurando entregadores');
    } else {
      title = t('Corrida em andamento');
    }
  } else {
    title = t('Corrida em andamento');
  }
  let detail = '';
  if (order.origin && order.destination) {
    if (dispatchingStatus === 'matching') {
      detail = `${order.origin.address.main}`;
    } else if (dispatchingState === 'going-pickup') {
      detail = `${t('À caminho de')} ${order.origin.address.main}`;
    } else if (dispatchingState === 'arrived-pickup') {
      detail = 'Aguardando retirada';
    } else if (dispatchingState === 'going-destination') {
      detail = `${t('À caminho de')} ${order.destination.address.main}`;
    } else if (dispatchingState === 'arrived-destination') {
      detail = 'Aguardando entrega';
    }
  }
  return (
    <TouchableOpacity onPress={() => onOpenChat(order)}>
      <View
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: colors.yellow }}
      >
        <View>
          <MessagesCard
            orderId={order.id}
            variant="coupled"
            onOpenChat={(from) => onOpenChat(order, from)}
          />
          <PaddedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            half
          >
            {order.type === 'food' ? (
              <IconRequest width={64} height={80} />
            ) : (
              <IconMotocycleCentered />
            )}
            <View style={{ marginLeft: padding, maxWidth: '80%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ ...texts.sm }} numberOfLines={2}>
                    {title}
                  </Text>
                  <Text
                    style={{
                      ...texts.xs,
                      color: colors.grey700,
                      flexWrap: 'wrap',
                      maxWidth: '97%',
                    }}
                    numberOfLines={3}
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
