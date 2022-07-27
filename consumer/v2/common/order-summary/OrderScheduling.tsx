import { getNextDateSlots, scheduleFromDate } from '@appjusto/dates';
import React from 'react';
import { Text, View } from 'react-native';
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
  // if (!business.preparationModes?.includes('scheduled')) return null;
  if (!nextDateSlots) return null;

  const scheduleUI = () => {
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
      } else return null;
    } else {
      if (business.status === 'closed') {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <View style={{ width: '48%' }}>
              <Text style={{ ...texts.xs }} numberOfLines={2}>
                {t('Esse restaurante só aceita pedidos agendados')}
              </Text>
            </View>
            <View style={{ width: '48%' }}>
              <RectangularListItemText
                text={t('Agendar horário')}
                selected={false}
                onSelect={onCheckSchedules!}
              />
            </View>
          </View>
        );
      }
      if (business.status === 'open') {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ marginRight: halfPadding }}>
              <RectangularListItemText
                text={
                  order.arrivals?.destination?.estimate
                    ? `Previsão: ${getETAWithMargin(order.arrivals.destination.estimate)}`
                    : t('Sem previsão')
                }
                selected={!order.scheduledTo}
                onSelect={() => api.order().updateOrder(order.id, { scheduledTo: null })}
              />
            </View>

            <RectangularListItemText
              text={t('Agendar horário')}
              selected={false}
              onSelect={onCheckSchedules!}
            />
          </View>
        );
      }
    }
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

      {scheduleUI()}
    </View>
  );
};
