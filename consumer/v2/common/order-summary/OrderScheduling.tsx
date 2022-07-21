import { formatRelativeDate, getNextDateSlots, scheduleFromDate } from '@appjusto/dates';
import { Timestamp } from 'firebase/firestore';
import { capitalize } from 'lodash';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ApiContext } from '../../../../common/app/context';
import { RectangularListItemText } from '../../../../common/components/list items/RectangularListItemText';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { useObserveBusiness } from '../../../../common/store/api/business/hooks/useObserveBusiness';
import { useContextActiveOrder } from '../../../../common/store/context/order';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { getETAWithMargin } from '../../../../common/utils/formatters/datetime';
import { t } from '../../../../strings';

type Props = {
  onCheckSchedules: () => void;
};

export const OrderScheduling = ({ onCheckSchedules }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const order = useContextActiveOrder();
  const api = React.useContext(ApiContext);
  const now = getServerTime();
  // state
  const business = useObserveBusiness(order?.business?.id);

  if (!order) return null; // shouldn't happen
  if (!business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  if (!business.preparationModes?.includes('scheduled')) return null;
  const { schedules } = business;
  const scheduleFromNow = scheduleFromDate(schedules, now);
  const nextDateSlots: Date[][] = getNextDateSlots(scheduleFromNow, now, 60);

  return (
    <View style={{ ...screens.default, width: '100%', paddingBottom: padding }}>
      {/* add this back when business.preparationModes[] is not empty */}
      {/* {canDeliver ? null : (
        <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              backgroundColor: colors.darkYellow,
              padding,
              borderRadius: halfPadding,
            }}
          >
            <Text style={{ ...texts.sm }}>
              {t('Esse restaurante somente aceita pedidos com horário agendado para entrega')}
            </Text>
          </View>
        </View>
      )} */}
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: eTA ? 'space-between' : 'flex-end',
          justifyContent: 'flex-end',
          paddingHorizontal: padding,
        }}
      >
        {/* {eTA ? (
          <View>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{eTA}</Text>
          </View>
        ) : null} */}
        <TouchableOpacity onPress={onCheckSchedules}>
          <Text style={{ ...texts.sm, color: colors.green600 }}>{t('Ver horários')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={{ marginTop: padding, paddingLeft: padding }}
        showsHorizontalScrollIndicator={false}
      >
        {order.arrivals?.destination?.estimate &&
        business.status === 'open' &&
        business.preparationModes?.includes('realtime') ? (
          <RectangularListItemText
            text={`Hoje, ${getETAWithMargin(order.arrivals.destination.estimate)}`}
            selected={!order.scheduledTo}
            onSelect={() => api.order().updateOrder(order.id, { scheduledTo: null })}
          />
        ) : null}
        {nextDateSlots.map((dayslots, i) =>
          dayslots.map((slot) => (
            <View style={{ marginLeft: halfPadding }} key={slot.toString()}>
              <RectangularListItemText
                text={`${capitalize(formatRelativeDate(slot, now))}, ${getETAWithMargin(slot)}`}
                selected={
                  Boolean(order.scheduledTo) &&
                  (order.scheduledTo as Timestamp).isEqual(Timestamp.fromDate(slot))
                }
                onSelect={() =>
                  api.order().updateOrder(order.id, { scheduledTo: Timestamp.fromDate(slot) })
                }
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
