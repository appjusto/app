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

export const TimerDisplay = ({ orderId, widthPercentage = 30, ...props }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const order = useObserveOrder(orderId);
  // state
  const [elapsedTime, setElapsedTime] = React.useState<number | null>(0);
  const [barWidth, setBarWidth] = React.useState<number | string | undefined>(0);
  // helpers
  const cookingTime = React.useMemo(
    () => (order?.cookingTime ? order?.cookingTime / 60 : null),
    [order?.cookingTime]
  );
  const now = getServerTime().getTime();
  const formattedTime = cookingTime ? round(cookingTime, 0) : '';
  const formattedInterval = `${elapsedTime} min`;
  // side effects
  // updating the elapsed time and progress bar width
  React.useEffect(() => {
    if (!order) return;
    if (!getServerTime) return;
    if (order.status !== 'preparing') return;
    const orderServerTime = (order.timestamps.confirmed as Timestamp).toDate().getTime();
    if (now && orderServerTime) {
      const delta = getTimeUntilNow(now, orderServerTime);
      setElapsedTime(delta);
      const cookingProgress = cookingTime && elapsedTime ? (elapsedTime / cookingTime) * 100 : 0;
      if (cookingProgress > 0) setBarWidth(`${cookingProgress}%`);
      else setBarWidth(0);
    } else setElapsedTime(null);
  }, [getServerTime, order, now, cookingTime, elapsedTime]);
  // UI
  if (!order) return null;
  if (order.status !== 'preparing' || !cookingTime) return null;
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
