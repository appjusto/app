import { round } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { IconAlarm } from '../../../common/icons/icon-alarm';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, texts } from '../../../common/styles';
import { useCookingTimer } from '../../hooks/useCookingTimer';

type Props = {
  orderId: string;
  widthPercentage?: number;
};

export const TimerDisplay = ({ orderId, widthPercentage = 30 }: Props) => {
  // context
  const order = useObserveOrder(orderId);
  const { progress, barProgress } = useCookingTimer(order);
  // UI
  if (!order) return null;
  if (order.status !== 'preparing' || !order?.cookingTime) return null;
  const formattedTime = round(order.cookingTime / 60, 0);
  const formattedInterval = `${progress} min`;
  return (
    <View style={{ width: `${widthPercentage}%` }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <IconAlarm />
        {progress !== undefined ? (
          <Text style={{ marginRight: halfPadding, marginLeft: 4, ...texts.xs, ...texts.bold }}>
            {formattedInterval}
          </Text>
        ) : null}
        <Text style={{ ...texts.xs, color: colors.grey700 }}>{formattedTime}</Text>
      </View>
      <View style={{ width: '100%' }}>
        <View
          style={{
            marginTop: 4,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.grey500,
            borderRadius: 8,
            height: halfPadding,
            width: '100%',
          }}
        >
          <View
            style={{
              height: halfPadding,
              borderRadius: 8,
              width: barProgress !== undefined ? barProgress : 0,
              backgroundColor: colors.black,
              borderColor: colors.black,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
        </View>
      </View>
    </View>
  );
};
