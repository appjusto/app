import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import { useChatIsEnabled } from '../../../common/hooks/useChatIsEnabled';
import { halfPadding, padding, texts } from '../../../common/styles';
import { formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { OrderLabel } from './OrderLabel';
import { TimerDisplay } from './TimerDisplay';

interface Props extends ViewProps {
  order: WithId<Order>;
  onOpenOrderChat: () => void;
}

export const OrderDetailHeader = ({ order, style, onOpenOrderChat }: Props) => {
  // state
  const chatStillActive = useChatIsEnabled(order);
  if (!order) return null;
  return (
    <View style={style}>
      <DoubleHeader
        title={`${t('Pedido Nº ')}${order.code}`}
        subtitle={`Horário do pedido: ${formatTime(order.createdOn) ?? 'Indisponível no momento'}`}
      />
      <PaddedView>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* order.status */}
          <OrderLabel order={order} />
          {/* spacer view */}
          <View style={{ width: padding, height: padding }} />
          {/* cooking time component. status === 'preparing' */}
          <TimerDisplay orderId={order.id} />
        </View>
        <Text style={{ ...texts.md, marginTop: halfPadding }}>
          {t('Nome do cliente: ')}
          <Text style={texts.bold}>{order.consumer.name ?? 'Indisponível no momento'}</Text>
        </Text>
        {/* TODO: add total consumer orders in that business */}
        {chatStillActive ? (
          <View style={{ width: '60%', marginTop: halfPadding }}>
            <DefaultButton
              title={t('Abrir chat com o cliente')}
              secondary
              onPress={onOpenOrderChat}
            />
          </View>
        ) : null}
      </PaddedView>
    </View>
  );
};
