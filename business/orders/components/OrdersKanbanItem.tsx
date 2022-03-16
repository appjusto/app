import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { CustomButton } from './CustomButton';
import { OrderLabel } from './OrderLabel';

type Props = {
  onCheckOrder: () => void;
  onTakeOrder: () => void;
  order: WithId<Order>;
};

export const OrdersKanbanItem = ({ onCheckOrder, onTakeOrder, order }: Props) => {
  if (!order) return null;
  const { status, dispatchingState } = order;
  let textColor;
  let background;
  let buttonTitle;
  if (status === 'confirmed') {
    textColor = colors.black;
    background = colors.green500;
    buttonTitle = t('Aceitar pedido');
  }
  if (status === 'ready') {
    if (dispatchingState === 'arrived-pickup') {
      textColor = colors.black;
      background = colors.darkYellow;
      buttonTitle = t('Entregar pedido');
    } else {
      textColor = colors.white;
      background = colors.grey700;
      buttonTitle = t('Preparo pronto');
    }
  } else {
    textColor = '';
    background = '';
    buttonTitle = '';
  }
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: padding,
        ...borders.default,
        backgroundColor: colors.white,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{order.consumer.name}</Text>
          <Text style={{ ...texts.sm }}>{order.code}</Text>
        </View>
        {/* "timing" component while "preparing" */}
        {status === 'preparing' ? (
          <View>
            <Text>Tempo de preparo</Text>
          </View>
        ) : null}
        <OrderLabel order={order} />
      </View>
      <View style={{ marginTop: padding }}>
        {order.status === 'confirmed' || order.status === 'ready' ? (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ width: '38%' }}>
              <DefaultButton secondary title={t('Ver pedido')} onPress={onCheckOrder} />
            </View>
            {/* dynamic title and background color */}
            <View style={{ width: '57%' }}>
              <CustomButton title={buttonTitle} bgColor={background} textColor={textColor} />
            </View>
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            <DefaultButton secondary title={t('Ver pedido')} onPress={onCheckOrder} />
          </View>
        )}
      </View>
    </View>
  );
};
