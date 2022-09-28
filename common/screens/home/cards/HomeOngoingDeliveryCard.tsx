import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import { IconMotocycleCentered } from '../../../icons/icon-motocycle-centered';
import { IconRequestSmall } from '../../../icons/icon-requests-small';
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
  const { business, courier, scheduledTo, fulfillment } = order;
  const showCode = order.code ? `#${order.code}` : null;
  let title = '';
  let detail = '';
  if (flavor === 'consumer') {
    if (type === 'food') {
      const businessName = business!.name;
      if (fulfillment === 'delivery') {
        if (status === 'confirming' || status === 'charged') {
          if (scheduledTo) {
            title = `${t('Agendando pedido no/a')} ${businessName}`;
          } else title = `${t('Criando pedido no/a')} ${businessName}`;
        } else if (status === 'declined') {
          title = t('Problema no pagamento');
          detail = t('Selecione outra forma de pagamento');
        } else if (status === 'scheduled') {
          title = `${t('Pedido agendado em')} ${businessName}`;
          detail = t('Você será avisado quando o pedido sair para a entrega');
        } else if (status === 'confirmed') {
          title = `${t('Aguardando')} ${businessName} ${t('confirmar o seu pedido')}`;
        } else if (status === 'preparing') {
          title = `${businessName} ${t('está preparando seu pedido')}`;
        } else if (status === 'ready' || status === 'dispatching') {
          if (status === 'ready') {
            title = t('Seu pedido está pronto!');
          } else if (status === 'dispatching') {
            title = t('Seu pedido está à caminho!');
          }
          if (dispatchingStatus === 'confirmed' || dispatchingStatus === 'outsourced') {
            if (dispatchingState === 'going-pickup') {
              detail = `${courier?.name ?? t('Entregador/a')} ${t(
                'está indo para'
              )} ${businessName}`;
            } else if (dispatchingState === 'arrived-pickup') {
              detail = `${courier?.name ?? t('Entregador/a')} ${t('chegou no/a')} ${businessName}`;
            } else if (dispatchingState === 'going-destination') {
              detail = `${t('À caminho de')} ${order.destination!.address.main}`;
            } else if (dispatchingState === 'arrived-destination') {
              detail = `${courier?.name ?? t('Entregador/a')} ${t('chegou!')}`;
            }
          } else if (dispatchingStatus === 'declined') {
            title = t('Problema no pagamento');
            detail = t('Selecione outra forma de pagamento');
          } else if (dispatchingStatus === 'no-match') {
            title = t('Sem entregadores/as na região');
            detail = t('Clique para tentar novamente');
          } else {
            detail = t('Procurando entregador/a');
          }
        }
      } else {
        if (status === 'confirming' || status === 'charged') {
          if (scheduledTo) {
            title = `${t('Agendando pedido no/a')} ${businessName}`;
          } else title = `${t('Criando pedido no/a')} ${businessName}`;
        } else if (status === 'declined') {
          title = t('Problema no pagamento');
          detail = t('Selecione outra forma de pagamento');
        } else if (status === 'scheduled') {
          title = `${t('Pedido agendado em')} ${businessName}`;
          detail = t('Você será avisado quando o estiver pronto para a retirada');
        } else if (status === 'confirmed') {
          title = `${t('Aguardando')} ${businessName} ${t('confirmar o seu pedido')}`;
        } else if (status === 'preparing') {
          title = `${businessName} ${t('está preparando seu pedido')}`;
        } else if (status === 'ready') {
          title = `${t('Seu pedido')} ${showCode} {t('está pronto!')}`;
          detail = t('Dirija-se ao restaurante para fazer a retirada');
        }
      }
    } else if (type === 'p2p') {
      if (status === 'confirming' || status === 'charged') {
        title = t('Criando seu pedido...');
      } else if (status === 'confirmed') {
        title = t('Procurando entregador/a próximo a');
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
          detail = 'No local de entrega';
        }
      }
      if (dispatchingStatus === 'no-match') {
        title = t('Sem entregadores/as na região');
        detail = t('Clique para tentar novamente');
      }
    }
  } else if (flavor === 'courier') {
    if (dispatchingState === 'going-pickup') {
      title =
        type === 'p2p'
          ? `${t('Indo para a coleta')}`
          : `${t('Indo para')} ${order.business!.name} ${showCode}`;
      detail = order.origin!.address.main!;
    } else if (dispatchingState === 'arrived-pickup') {
      title =
        type === 'p2p'
          ? t('No local de coleta')
          : `${t('No/a')} ${order.business!.name}  ${showCode}`;
      detail =
        type === 'p2p'
          ? order.origin?.intructions ??
            `${t('Qualquer dúvida, mande uma mensagem para ')} ${order.consumer.name}`
          : `${t('Informe o código')} ${order.code}`;
    } else if (dispatchingState === 'going-destination') {
      title = `${t('Indo para a entrega')}  ${showCode}`;
      detail = order.destination!.address.main!;
    } else if (dispatchingState === 'arrived-destination') {
      title = `${t('No local de entrega')}  ${showCode}`;
      detail =
        type === 'p2p'
          ? order.destination?.intructions ??
            `${t('Qualquer dúvida, mande uma mensagem para ')} ${order.consumer.name}`
          : `${t('Avise')} ${order.consumer.name} ${t('da sua chegada.')}`;
    }
  }

  return (
    <TouchableOpacity onPress={() => onPress(order)}>
      <View
        style={{
          ...borders.default,
          borderColor: colors.darkYellow,
          backgroundColor: colors.yellow,
        }}
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
          >
            {flavor === 'courier' ? <IconMotocycleCentered /> : <IconRequestSmall />}
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
