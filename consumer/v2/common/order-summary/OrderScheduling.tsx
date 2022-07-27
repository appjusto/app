import { formatRelativeDate, getNextDateSlots, scheduleFromDate } from '@appjusto/dates';
import { PreparationMode } from '@appjusto/types';
import { Timestamp } from 'firebase/firestore';
import { capitalize, isEqual } from 'lodash';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ApiContext } from '../../../../common/app/context';
import { RectangularListItemText } from '../../../../common/components/list items/RectangularListItemText';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { useContextBusiness } from '../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../common/store/context/order';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { getETAWithMargin } from '../../../../common/utils/formatters/datetime';
import { t } from '../../../../strings';

type Props = {
  onCheckSchedules?: () => void;
};

export const OrderScheduling = ({ onCheckSchedules }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const order = useContextActiveOrder();
  const business = useContextBusiness();
  const api = React.useContext(ApiContext);
  const now = getServerTime();
  // state
  const [nextDateSlots, setNextDateSlots] = React.useState<Date[][]>();
  // side effects
  React.useEffect(() => {
    if (!business?.id) return;
    const { schedules } = business;
    const scheduleFromNow = scheduleFromDate(schedules, now);
    setNextDateSlots(getNextDateSlots(scheduleFromNow, now, 60, 5));
  }, [business?.id]);
  // UI
  if (!order) return null; // shouldn't happen
  if (!business) return null; // shouldn't happen
  if (!business.preparationModes?.includes('scheduled')) return null;
  if (!nextDateSlots) return null;

  return (
    <View style={{ ...screens.default, width: '100%', paddingBottom: padding }}>
      {isEqual(business.preparationModes, ['scheduled'] as PreparationMode[]) ? (
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
      ) : null}
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
          <Text style={{ ...texts.sm, color: colors.green600 }}>{t('Ver mais horários')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={{ marginTop: padding, paddingLeft: padding }}
        showsHorizontalScrollIndicator={false}
      >
        {order.arrivals?.destination?.estimate &&
        business.status === 'open' &&
        (!business.preparationModes || business.preparationModes.includes('realtime')) ? (
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
