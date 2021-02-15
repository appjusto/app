import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../../assets/icons';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import { IconRequest } from '../../../icons/icon-requests';
import { borders, colors, padding, texts } from '../../../styles';
import { MessagesCard } from './MessagesCard';

type Props = {
  order: WithId<Order>;
  onSelect: (order: WithId<Order>, openChat: boolean) => void;
};

export default function ({ order, onSelect }: Props) {
  // UI
  const title =
    order.dispatchingState === 'matching'
      ? t('Procurando entregadores próximos à')
      : t('Corrida em andamento');
  let detail = '';
  if (order.origin && order.destination) {
    if (order.dispatchingState === 'matching') {
      detail = `${order.origin.address.main}`;
    } else if (order.dispatchingState === 'going-pickup') {
      detail = `${t('À caminho de')} ${order.origin.address.main}`;
    } else if (order.dispatchingState === 'arrived-pickup') {
      detail = order.origin.intructions ?? 'Aguardando retirada';
    } else if (order.dispatchingState === 'going-destination') {
      detail = `${t('À caminho de')} ${order.destination.address.main}`;
    } else if (order.dispatchingState === 'arrived-destination') {
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
            {order.type === 'food' ? <IconRequest /> : <Image source={icons.motocycleWhite} />}
            <View style={{ marginLeft: padding }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ ...texts.default }}>{title}</Text>
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
