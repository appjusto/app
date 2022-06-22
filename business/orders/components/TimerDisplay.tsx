import { Timestamp } from 'firebase/firestore';
import { round } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { useContextGetSeverTime } from '../../../common/contexts/ServerTimeContext';
import { IconAlarm } from '../../../common/icons/icon-alarm';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { colors, halfPadding, texts } from '../../../common/styles';
import { getTimeUntilNow } from '../helpers';

type Props = {
  orderId: string;
  widthPercentage?: number;
};

export const TimerDisplay = ({ orderId, widthPercentage = 30 }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const order = useObserveOrder(orderId);
  // state
  const [elapsedTime, setElapsedTime] = React.useState<number>(0);
  const [barWidth, setBarWidth] = React.useState<number | string>(0);
  const [ticking] = React.useState(true);
  // helpers
  // side effects
  // updating the elapsed time and progress bar width
  const update = React.useCallback(() => {
    if (!getServerTime) return;
    if (!order?.timestamps.confirmed) return;
    if (!order?.cookingTime) return;
    const { cookingTime, timestamps } = order;
    const now = getServerTime().getTime();
    const confirmedAt = (timestamps.confirmed as Timestamp).toDate().getTime();
    const elapsedTime = getTimeUntilNow(now, confirmedAt);
    setElapsedTime(elapsedTime);
    const cookingProgress = cookingTime && elapsedTime ? (elapsedTime / cookingTime) * 100 : 0;
    if (cookingProgress > 0) setBarWidth(`${cookingProgress}%`);
    else setBarWidth(0);
  }, [getServerTime, order?.cookingTime, order?.timestamps.confirmed]);
  // tick
  React.useEffect(() => {
    if (ticking) {
      const interval = setInterval(update, 30 * 1000);
      return () => clearInterval(interval);
    }
  }, [ticking]);
  // UI
  if (!order) return null;
  if (order.status !== 'preparing' || !order?.cookingTime) return null;
  const formattedTime = round(order.cookingTime, 0); // fix this
  const formattedInterval = `${elapsedTime} min`;
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
        <Text style={{ marginRight: halfPadding, marginLeft: 4, ...texts.xs, ...texts.bold }}>
          {formattedInterval}
        </Text>
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
              width: barWidth,
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
