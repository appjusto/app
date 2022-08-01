import { Dayjs, getNextDateSlots, scheduleFromDate } from '@appjusto/dates';
import { Timestamp } from 'firebase/firestore';
import { capitalize } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { ApiContext } from '../../../../common/app/context';
import { RectangularListItemText } from '../../../../common/components/list items/RectangularListItemText';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { useContextBusiness } from '../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../common/store/context/order';
import { colors, padding, screens, texts } from '../../../../common/styles';
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
  const margin = 60;
  React.useEffect(() => {
    if (!business?.id) return;
    const { schedules } = business;
    const scheduleFromNow = scheduleFromDate(schedules, now);
    setNextDateSlots(getNextDateSlots(scheduleFromNow, now, margin, 5));
  }, [business?.id]);
  // UI
  if (!order) return null; // shouldn't happen
  if (!business) return null; // shouldn't happen
  if (!nextDateSlots) return null;
  const canScheduleUI = () => {
    // realtime and scheduling
    if (business.preparationModes?.includes('realtime')) {
      if (order.scheduledTo) {
        return (
          <RectangularListItemText
            text={`${capitalize(
              Dayjs((order.scheduledTo as Timestamp).toDate()).calendar(now, {
                sameDay: '[hoje]',
                nextDay: 'dddd',
                nextWeek: 'dddd',
              })
            )}, ${getETAWithMargin(order.scheduledTo, margin)}`}
            selected
            onSelect={() => null}
          />
        );
      } else {
        if (business.status === 'open') {
          // without scheduledTo
          if (order.arrivals?.destination?.estimate) {
            return (
              <RectangularListItemText
                text={`Entrega: ${getETAWithMargin(order.arrivals?.destination?.estimate!)}`}
                selected
                onSelect={() => null}
              />
            );
          }
          return null;
        }
        if (business.status === 'closed') {
          // without scheduledTo
          return (
            <View>
              <Text style={{ ...texts.sm, flexWrap: 'wrap' }} numberOfLines={3}>
                {t('Somente agendamento')}
              </Text>
            </View>
          );
        }
      }
      return null;
    }
    // no realtime, only scheduling
    else {
      if (order.scheduledTo) {
        return (
          <RectangularListItemText
            text={`${capitalize(
              Dayjs((order.scheduledTo as Timestamp).toDate()).calendar(now, {
                sameDay: '[hoje]',
                nextDay: 'dddd',
                nextWeek: 'dddd',
              })
            )}, ${getETAWithMargin(order.scheduledTo, margin)}`}
            selected
            onSelect={() => null}
          />
        );
      } else {
        return (
          <View>
            <Text style={{ ...texts.sm, flexWrap: 'wrap' }} numberOfLines={3}>
              {t('Somente agendamento')}
            </Text>
          </View>
        );
      }
    }
  };
  const orderSchedulingUI = () => {
    // real time only
    if (!business.preparationModes?.includes('scheduled')) {
      if (order.arrivals?.destination?.estimate) {
        return (
          <View style={{ alignSelf: 'center' }}>
            <Text style={{ ...texts.sm }}>
              {t('Previsão de entrega: ')}
              {getETAWithMargin(order.arrivals.destination.estimate)}
            </Text>
          </View>
        );
      }
      return null;
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>{canScheduleUI()}</View>
        <View>
          <RectangularListItemText
            text={t('Agendar horário')}
            selected={false}
            onSelect={onCheckSchedules!}
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        ...screens.default,
        width: '100%',
        paddingBottom: padding,
        paddingHorizontal: padding,
      }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.grey500,
          marginBottom: padding,
        }}
      />
      {orderSchedulingUI()}
    </View>
  );
};
