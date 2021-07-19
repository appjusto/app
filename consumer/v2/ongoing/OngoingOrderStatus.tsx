import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../common/components/texts/RoundedText';
import { IconOngoingMotocycle } from '../../../common/icons/icon-ongoing-motocycle';
import { IconOngoingStatus } from '../../../common/icons/icon-ongoing-status';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { getETAWithMargin } from '../../../common/utils/formatters/datetime';
import { t } from '../../../strings';

interface Props {
  order: Order;
}

export const OngoingOrderStatus = ({ order }: Props) => {
  const { status, dispatchingState, type, dispatchingStatus } = order;
  let header: string | null = null;
  let description: string | null = null;

  if (type === 'food') {
    if (status === 'confirmed') {
      header = t('Pedido aprovado!');
      description = t('Aguarde enquanto o restaurante confirma seu pedido.');
    } else if (status === 'preparing') {
      header = t('Pedido em preparo');
      description = t(
        'O restaurante começou a preparar seu pedido e logo estará prontinho para você.'
      );
    } else if (status === 'ready') {
      if (dispatchingStatus === 'matching' || dispatchingStatus === 'matched') {
        header = t('Pronto para entrega');
        description = t('Estamos procurando um/a entregador/a para o seu pedido');
      } else if (dispatchingStatus === 'confirmed') {
        header = t('Pronto para entrega');
        description = t('Estamos procurando um/a entregador/a para o seu pedido');
        if (dispatchingState === 'going-pickup') {
          header = t('Indo para o restaurante');
          description = `${order.courier?.name ?? t('O/A entregador/a')} ${t(
            'já está indo pegar o pedido.'
          )}`;
        } else if (dispatchingState === 'arrived-pickup') {
          header = t('Aguardando retirada');
          description = `${order.courier?.name ?? t('O/A entregador/a')} ${t(
            'já chegou ao restaurante.'
          )}`;
        }
      }
    } else if (status === 'dispatching') {
      if (dispatchingStatus === 'outsourced') {
        header = t('Entrega em andamento');
        description = t('A entrega está sendo realizada por um entregador externo');
      } else {
        if (dispatchingState === 'arrived-pickup') {
          header = t('Retirada efetuada');
          description = `${order.courier?.name ?? t('O/A entregador/a')} ${t(
            'já está com o pedido em mãos.'
          )}`;
        } else if (dispatchingState === 'going-destination') {
          header = t('Saiu para entrega');
          description = `${t('Já pode se preparar!')} ${
            order.courier?.name ?? t('O/A entregador/a')
          } ${t('saiu e está levando o pedido até você.')}`;
        } else if (dispatchingState === 'arrived-destination') {
          header = `${order.courier?.name ?? t('O/A entregador/a')} ${t('chegou!')}`;
          description = `${order.courier?.name ?? t('O/A entregador/a')} ${t(
            'já está no local de entrega.'
          )}`;
        }
      }
    } else if (status === 'delivered') {
      header = t('Pedido entregue!');
      description = '';
    } else if (status === 'canceled') {
      header = t('Pedido cancelado!');
      description = '';
    } else if (status === 'declined') {
      header = t('Problemas no pagamento');
      description = '';
    }
  } else if (type === 'p2p') {
    if (status === 'confirmed') {
      header = t('Pedido aprovado!');
      description = t('Aguarde enquanto procuramos um/a entregador/a para você.');
    } else if (status === 'dispatching') {
      if (dispatchingState === 'going-pickup') {
        header = t('Indo para a coleta');
        description = `${order.courier?.name ?? t('O/A entregador/a')} ${t(
          'está indo para o local de coleta.'
        )}`;
      } else if (dispatchingState === 'arrived-pickup') {
        header = t('Aguardando coleta');
        description = `${order.courier?.name ?? t('O/A entregador/a')} ${t(
          'já chegou ao local de coleta.'
        )}`;
      } else if (dispatchingState === 'going-destination') {
        header = t('Saiu para entrega');
        description = `${t('Já pode se preparar!')} ${
          order.courier?.name ?? t('O/A entregador/a')
        } ${t('saiu e já está levando a encomenda ao destino.')}`;
      } else if (dispatchingState === 'arrived-destination') {
        header = `${order.courier?.name ?? t('O/A entregador/a')} ${t('chegou!')}`;
        description = `${order.courier?.name ?? t('O/A entregador/a')} ${t(
          'já está no local de entrega.'
        )}`;
      }
    } else if (status === 'delivered') {
      header = t('Pedido entregue!');
      description = '';
    } else if (status === 'canceled') {
      header = t('Pedido cancelado!');
      description = '';
    } else if (status === 'declined') {
      header = t('Problemas no pagamento');
      description = '';
    }
  }

  return (
    <View style={{ paddingHorizontal: padding, paddingVertical: padding }}>
      {status === 'dispatching' && dispatchingState === 'arrived-destination' ? (
        <IconOngoingMotocycle />
      ) : (
        <IconOngoingStatus />
      )}

      <Text style={{ marginTop: halfPadding, ...texts.xl }}>{header}</Text>
      <Text
        style={{
          ...texts.sm,
          color: colors.grey700,
          marginTop: halfPadding,
        }}
      >
        {description}
      </Text>
      {order.destination?.estimatedTimeOfArrival &&
        order.dispatchingState !== 'arrived-destination' && (
          <View style={{ marginTop: padding }}>
            <RoundedText color={colors.grey700} backgroundColor={colors.grey50} noBorder>{`${t(
              'Previsão de entrega: '
            )} ${getETAWithMargin(order.destination.estimatedTimeOfArrival)}`}</RoundedText>
          </View>
        )}
    </View>
  );
};
