import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import { IconMotocycleCentered } from '../../../icons/icon-motocycle-centered';
import { IconRequest } from '../../../icons/icon-requests';
import { getFlavor } from '../../../store/config/selectors';
import { borders, colors, padding, texts } from '../../../styles';
import { MessagesCard } from './MessagesCard';

type Props = {
  order: WithId<Order>;
  onPress: (order: WithId<Order>, message?: ChatMessageUser) => void;
};

export default function ({ order, onPress }: Props) {
  const { dispatchingStatus, dispatchingState, type, status } = order;
  // redux store
  const flavor = useSelector(getFlavor);
  // UI
  let title = '';
  let detail = '';
  if (flavor === 'consumer') {
    if (type === 'food') {
      if (status === 'confirming') {
        title = t('Aguarde enquanto criamos seu pedido...');
      } else if (status === 'confirmed') {
        title = t('Aguarde enquanto o restaurante confirma seu pedido.');
      } else if (status === 'declined') {
        title = t('Problema no pagamento');
        detail = t('Selecione outra forma de pagamento');
      } else if (status === 'preparing') {
        title = t('Pedido em preparo no estabelecimento');
      } else if (status === 'ready') {
        if (dispatchingStatus === 'matching') {
          title = t('Procurando entregadores');
        } else if (dispatchingStatus === 'confirmed') {
          title = t('Corrida em andamento');
          if (dispatchingState === 'going-pickup') {
            detail = `${t('À caminho de')} ${order.business!.name}`;
          } else if (dispatchingState === 'arrived-pickup') {
            detail = t('Aguardando retirada');
          } else if (!dispatchingState) {
            title = t('Corrida em andamento');
          }
        } else if (dispatchingStatus === 'matched') {
          title = t('Corrida em andamento');
        }
      } else if (status === 'dispatching') {
        title = t('Corrida em andamento');
        if (dispatchingState === 'arrived-pickup') {
          detail = t('Retirada efetuada');
        } else if (dispatchingState === 'going-destination') {
          detail = `${t('À caminho de')} ${order.destination!.address.main}`;
        } else if (dispatchingState === 'arrived-destination') {
          detail = 'Entregador chegou para entrega';
        }
      }
    }
    if (type === 'p2p') {
      if (status === 'confirming') {
        title = t('Aguarde enquanto criamos seu pedido...');
      } else if (status === 'confirmed') {
        title = t('Procurando entregador próximo a.');
        detail = `${order.origin!.address.main}`;
      } else if (status === 'declined') {
        title = t('Problema no pagamento');
        detail = t('Selecione outra forma de pagamento');
      } else if (status === 'dispatching') {
        title = t('Corrida em andamento');
        if (dispatchingState === 'going-pickup') {
          detail = `${t('À caminho de')} ${order.origin!.address.main}`;
        } else if (dispatchingState === 'arrived-pickup') {
          detail = 'Aguardando retirada';
        } else if (dispatchingState === 'going-destination') {
          detail = `${t('À caminho de')} ${order.destination!.address.main}`;
        } else if (dispatchingState === 'arrived-destination') {
          detail = 'Aguardando entrega';
        }
      }
    }
  }

  return (
    <TouchableOpacity onPress={() => onPress(order)}>
      <View
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: colors.yellow }}
      >
        <View>
          <MessagesCard
            orderId={order.id}
            variant="coupled"
            onPress={(from) => onPress(order, from)}
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
                  maxWidth: '95%',
                }}
              >
                <View style={{ width: '100%' }}>
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
