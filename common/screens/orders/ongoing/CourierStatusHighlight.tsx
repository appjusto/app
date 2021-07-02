import { Order, OrderConfirmation, WithId } from '@appjusto/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from '../../../../strings';
import useTallerDevice from '../../../hooks/useTallerDevice';
import { IconMotocycleCentered } from '../../../icons/icon-motocycle-centered';
import { getFlavor } from '../../../store/config/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../styles';

type Props = {
  order: WithId<Order>;
  confirmation?: OrderConfirmation;
};

export const CourierStatusHighlight = ({ order, confirmation }: Props) => {
  // params
  const { type, status, dispatchingState, code } = order;
  // context
  const tallerDevice = useTallerDevice();
  // redux store
  const flavor = useSelector(getFlavor);
  // UI
  let title = '';
  let message = '';
  if (flavor === 'consumer') {
    if (type === 'food') {
      if (dispatchingState === 'arrived-pickup') {
        title = t('Entregador/a chegou ao restaurante');
        message = t('Entregador/a está aguardando receber o pedido do restaurante.');
        if (status === 'dispatching' && order.dispatchingStatus === 'confirmed') {
          title = t('Entregador/a chegou ao restaurante');
          message = t('Entregador/a retirou o pedido e sairá para a entrega em instantes.');
        }
      } else if (dispatchingState === 'arrived-destination') {
        title = t('Entregador/a chegou!');
        if (confirmation?.handshakeChallenge) {
          message = t(
            `Informe o código ${confirmation.handshakeChallenge} para o/a entregador/a finalizar o pedido.`
          );
        } else {
          message = t('Entregador/a está esperando para entregar o pedido.');
        }
      }
    } else if (type === 'p2p') {
      if (dispatchingState === 'arrived-pickup') {
        title = t('Entregador/a chegou ao local');
        message = t('Entregador/a está aguardando para receber a encomenda.');
      } else if (dispatchingState === 'arrived-destination') {
        title = t('Entregador/a chegou!');
        message = t('Entregador/a está esperando para entregar a encomenda.');
      }
    }
  } else if (flavor === 'courier') {
    if (type === 'food') {
      if (dispatchingState === 'arrived-pickup') {
        if (status === 'preparing') {
          title = t('Aguardando pedido ficar pronto');
          message = t('Confirme sua saída somente após receber o pedido');
        } else if (status === 'ready') {
          title = t('Pedido pronto!');
          message = `${t('Informe o código')} ${code} para retirar o pedido.`;
        }
      } else if (dispatchingState === 'arrived-destination') {
        title = t('Aguardando para fazer entrega');
        message = t('Finalize a corrida somente após realizar a entrega.');
      }
    } else if (type === 'p2p') {
      if (dispatchingState === 'arrived-pickup') {
        title = t('Aguardando para fazer coleta');
        message = t('Confirme sua saída somente após pegar a encomenda.');
      } else if (dispatchingState === 'arrived-destination') {
        title = t('Aguardando para fazer entrega');
        message = t('Finalize a corrida somente após realizar a entrega.');
      }
    }
  }
  if (!title && !message) return null;
  return (
    <View style={{ paddingHorizontal: padding }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View
          style={[
            styles.card,
            {
              padding: tallerDevice ? padding : halfPadding,
              marginBottom: tallerDevice ? padding : halfPadding,
              position: 'absolute',
              bottom: halfPadding,
              width: '100%',
              // marginHorizontal: tallerDevice ? padding : halfPadding,
            },
          ]}
        >
          <IconMotocycleCentered />
          <View style={{ marginLeft: padding, flex: 1 }}>
            <Text style={{ ...texts.sm }}>{title}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...texts.xs,
                  color: colors.grey700,
                  flexWrap: 'wrap',
                }}
                numberOfLines={3}
              >
                {message}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...borders.default,
    borderColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.yellow,
  },
});
