import { Order, WithId } from '@appjusto/types';
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
  onSelect: (order: WithId<Order>, openChat: boolean) => void;
};

export default function ({ order, onSelect }: Props) {
  const { dispatchingStatus, dispatchingState } = order;
  // UI
  const title =
    dispatchingStatus === 'matching'
      ? t('Procurando entregadores próximos à')
      : t('Corrida em andamento');
  let detail = '';
  if (order.origin && order.destination) {
    if (dispatchingStatus === 'matching') {
      detail = `${order.origin.address.main}`;
    } else if (dispatchingState === 'going-pickup') {
      detail = `${t('À caminho de')} ${order.origin.address.main}`;
    } else if (dispatchingState === 'arrived-pickup') {
      detail = order.origin.intructions ?? 'Aguardando retirada';
    } else if (dispatchingState === 'going-destination') {
      detail = `${t('À caminho de')} ${order.destination.address.main}`;
    } else if (dispatchingState === 'arrived-destination') {
      detail = order.destination.intructions ?? 'Aguardando entrega';
    }
  }
  return (
    <TouchableOpacity onPress={() => onSelect(order, false)}>
      <View
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: colors.yellow }}
      >
        <View>
          <MessagesCard
            orderId={order.id}
            variant="coupled"
            onPress={() => onSelect(order, true)}
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
            <View style={{ marginLeft: padding }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ ...texts.sm }}>{title}</Text>
                  <Text
                    style={{
                      ...texts.xs,
                      color: colors.grey700,
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
