import { OrderStatus } from 'appjusto-types';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { IconRequestSmall } from '../../../../common/icons/icon-requests-small';
import { useObserveOrders } from '../../../../common/store/api/order/hooks/useObserveOrders';
import {
  getDeliveredOrders,
  getOrdersSince,
  summarizeOrders,
} from '../../../../common/store/order/selectors';
import { getUser } from '../../../../common/store/user/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

export default function () {
  // app state
  const user = useSelector(getUser);
  // state
  // TO-DO: add parameter to fetch only orders delivered on the last week
  const options = React.useMemo(
    () => ({ courierId: user?.uid, statuses: ['delivered'] as OrderStatus[] }),
    [user?.uid]
  );
  const orders = useObserveOrders(options);
  const todaysOrdersFee = useMemo(() => {
    const today = dayjs().startOf('d').toDate();
    const todaysOrders = getOrdersSince(getDeliveredOrders(orders), today);
    return summarizeOrders(todaysOrders).courierFee;
  }, [orders]);
  const weeksOrdersFee = useMemo(() => {
    const startOfWeek = dayjs().isoWeekday(1).startOf('w').toDate();
    const weeksOrders = getOrdersSince(getDeliveredOrders(orders), startOfWeek);
    return summarizeOrders(weeksOrders).courierFee;
  }, [orders]);

  return (
    <PaddedView
      style={{
        ...borders.default,
        borderColor: colors.grey50,
        backgroundColor: colors.white,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconRequestSmall />
        <View style={{ marginLeft: padding }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Hoje')}</Text>
              <Text style={{ ...texts.md, color: colors.black }}>
                {formatCurrency(todaysOrdersFee)}
              </Text>
            </View>
            <View>
              <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Semana')}</Text>
              <Text style={{ ...texts.md, color: colors.black }}>
                {formatCurrency(weeksOrdersFee)}
              </Text>
            </View>
          </View>
          <Text style={{ marginTop: halfPadding, ...texts.xs, color: colors.grey700 }}>
            {t('Veja todos os seus ganhos')}
          </Text>
        </View>
      </View>
    </PaddedView>
  );
}
