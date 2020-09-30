import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import {
  getDeliveredOrders,
  getOrders,
  getOrdersSince,
  summarizeOrders,
} from '../../../common/store/order/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';

export default function () {
  const orders = useSelector(getOrders);
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
        borderColor: colors.lightGrey,
        backgroundColor: colors.white,
      }}
      half
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={icons.requests} />
        <View style={{ marginLeft: padding }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Hoje')}</Text>
              <Text style={{ ...texts.medium, color: colors.black }}>
                {formatCurrency(todaysOrdersFee)}
              </Text>
            </View>
            <View>
              <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Semana')}</Text>
              <Text style={{ ...texts.medium, color: colors.black }}>
                {formatCurrency(weeksOrdersFee)}
              </Text>
            </View>
          </View>
          <Text style={{ marginTop: halfPadding, ...texts.small, color: colors.darkGrey }}>
            {t('Veja todos os seus ganhos')}
          </Text>
        </View>
      </View>
    </PaddedView>
  );
}
