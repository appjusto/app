import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import request from '../../../assets/lottie-icons/request.json';
import { Lottie } from '../../../common/components/icons/Lottie';
import RoundedText from '../../../common/components/texts/RoundedText';
import { IconOngoingMotocycle } from '../../../common/icons/icon-ongoing-motocycle';
import { IconOngoingStatus } from '../../../common/icons/icon-ongoing-status';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatDate, getETAWithMargin } from '../../../common/utils/formatters/datetime';
import { t } from '../../../strings';

interface Props {
  order: Order;
}

export const OngoingOrderStatus = ({ order }: Props) => {
  const { status, dispatchingState, type, dispatchingStatus } = order;
  let header: string | null = null;
  let description: string | null = null;

  if (type === 'food') {
    if (status === 'confirming' || status === 'charged') {
      description = t('Aguarde enquanto criamos seu pedido...');
    } else if (status === 'scheduled') {
      header = t('Pedido agendado');
      description = `${t('Você receberá uma notificação quando')} ${order.business!.name} ${t(
        'começar a preparar seu pedido.'
      )}`;
    } else if (status === 'confirmed') {
      header = t('Aguardando restaurante');
      description = t('Aguarde enquanto o restaurante confirma seu pedido.');
    } else if (status === 'preparing') {
      header = t('Pedido em preparo');
      description = `${order.business!.name} ${t(
        'começou a preparar seu pedido e logo estará prontinho para você.'
      )}`;
    } else if (status === 'ready') {
      if (dispatchingStatus === 'outsourced') {
        header = t('Entrega em andamento');
        description = t(
          'A entrega está sendo feita por um entregador alocado por fora do sistema e não será possível acompanhar seu deslocamento'
        );
      } else if (
        dispatchingStatus === 'matching' ||
        dispatchingStatus === 'matched' ||
        dispatchingStatus === 'scheduled'
      ) {
        header = t('Pronto para entrega');
        description = t('Estamos procurando um/a entregador/a para o seu pedido');
      } else if (dispatchingStatus === 'confirmed') {
        header = t('Pronto para entrega');
        description = t('Estamos procurando um/a entregador/a para o seu pedido');
        if (dispatchingState === 'going-pickup') {
          header = `${t('Indo para')} ${order.business!.name}`;
          description = `${order.courier?.name ?? 'O entregador'} ${t(
            'já está indo pegar o pedido.'
          )}`;
        } else if (dispatchingState === 'arrived-pickup') {
          header = t('Aguardando retirada');
          description = `${order.courier?.name ?? 'O entregador'} ${t(
            'já chegou ao restaurante.'
          )}`;
        }
      }
    } else if (status === 'dispatching') {
      if (dispatchingStatus === 'outsourced') {
        header = t('Entrega em andamento');
        description = t(
          'A entrega está sendo feita por um entregador alocado por fora do sistema e não será possível acompanhar seu deslocamento'
        );
      } else {
        if (dispatchingState === 'arrived-pickup') {
          header = t('Retirada efetuada');
          description = `${order.courier?.name ?? 'O entregador'} ${t(
            'já está com o pedido em mãos.'
          )}`;
        } else if (dispatchingState === 'going-destination') {
          header = t('Saiu para entrega');
          description = `${t('Já pode se preparar!')} ${order.courier?.name ?? 'O entregador'} ${t(
            'saiu e está levando o pedido até você.'
          )}`;
        } else if (dispatchingState === 'arrived-destination') {
          header = `${order.courier?.name ?? 'O entregador'} ${t('chegou!')}`;
          description = `${order.courier?.name ?? 'O entregador'} ${t(
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
      if (dispatchingStatus === 'outsourced') {
        header = t('Entrega em andamento');
        description = t(
          'A entrega está sendo feita por um entregador alocado por fora do sistema e não será possível acompanhar seu deslocamento'
        );
      } else {
        header = t('Pedido aprovado!');
        description = t('Aguarde enquanto procuramos um/a entregador/a para você.');
      }
    } else if (status === 'dispatching') {
      if (dispatchingState === 'going-pickup') {
        header = t('Indo para a coleta');
        description = `${order.courier?.name ?? 'O entregador'} ${t(
          'está indo para o local de coleta.'
        )}`;
      } else if (dispatchingState === 'arrived-pickup') {
        header = t('Aguardando coleta');
        description = `${order.courier?.name ?? 'O entregador'} ${t(
          'já chegou ao local de coleta.'
        )}`;
      } else if (dispatchingState === 'going-destination') {
        header = t('Saiu para entrega');
        description = `${t('Já pode se preparar!')} ${order.courier?.name ?? 'O entregador'} ${t(
          'saiu e já está levando a encomenda ao destino.'
        )}`;
      } else if (dispatchingState === 'arrived-destination') {
        header = `${order.courier?.name ?? 'O entregador'} ${t('chegou!')}`;
        description = `${order.courier?.name ?? 'O entregador'} ${t(
          'já está no local de entrega.'
        )}`;
      } else if (dispatchingStatus === 'outsourced') {
        header = t('Entrega em andamento');
        description = t(
          'A entrega está sendo feita por um entregador alocado por fora do sistema e não será possível acompanhar seu deslocamento'
        );
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
  // UI
  const iconsUI = () => {
    if (status === 'preparing' || status === 'confirmed' || status === 'charged')
      return <Lottie animationObject={request} iconStyle={{ width: 65, height: 65 }} />;
    if (status === 'dispatching' && dispatchingState === 'arrived-destination')
      return <IconOngoingMotocycle />;
    else return <IconOngoingStatus />;
  };
  return (
    <View style={{ paddingHorizontal: padding, paddingVertical: padding }}>
      {iconsUI()}
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
      {order.arrivals?.destination?.estimate && order.dispatchingState !== 'arrived-destination' && (
        <View style={{ marginTop: padding }}>
          {order.status === 'scheduled' ? (
            // TODO: add delivery time
            <RoundedText color={colors.grey700} backgroundColor={colors.grey50} noBorder>{`${t(
              'Previsão de entrega:'
            )} ${formatDate(order.scheduledTo!)}, ${getETAWithMargin(
              order.scheduledTo!
            )}`}</RoundedText>
          ) : (
            <RoundedText color={colors.grey700} backgroundColor={colors.grey50} noBorder>{`${t(
              'Previsão de entrega:'
            )} ${getETAWithMargin(order.arrivals.destination.estimate)}`}</RoundedText>
          )}
        </View>
      )}
    </View>
  );
};
