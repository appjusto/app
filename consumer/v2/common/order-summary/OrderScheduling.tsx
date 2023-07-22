import { Dayjs } from '@appjusto/dates';
import { Timestamp } from 'firebase/firestore';
import { capitalize } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { RectangularListItemText } from '../../../../common/components/list items/RectangularListItemText';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { isAvailable } from '../../../../common/store/api/business/selectors';
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
  const now = getServerTime();

  // UI
  if (!order) return null; // shouldn't happen
  if (!business) return null; // shouldn't happen
  const margin = 60;
  const shouldBeReady = new Date(
    now.getTime() + (business.averageCookingTime ? business.averageCookingTime * 1000 : 3600 * 1000)
  );
  const { fulfillment, scheduledTo } = order;
  const available = isAvailable(business.schedules, now);
  const canScheduleUI = () => {
    // realtime and scheduling
    if (fulfillment === 'delivery') {
      if (business.preparationModes?.includes('realtime')) {
        if (scheduledTo) {
          return (
            <RectangularListItemText
              text={`${capitalize(
                Dayjs((order.scheduledTo as Timestamp).toDate()).calendar(now)
              )}, ${getETAWithMargin(scheduledTo, margin)}`}
              selected
              onSelect={() => null}
            />
          );
        } else {
          if (available) {
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
            return (
              <View style={screens.centered}>
                <ActivityIndicator size="small" color={colors.green500} />
              </View>
            );
          }
          if (!available) {
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
        if (scheduledTo) {
          return (
            <RectangularListItemText
              text={`${capitalize(
                Dayjs((scheduledTo as Timestamp).toDate()).calendar(now)
              )}, ${getETAWithMargin(scheduledTo, margin)}`}
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
    } else {
      if (scheduledTo) {
        return (
          <RectangularListItemText
            text={`${capitalize(
              Dayjs((order.scheduledTo as Timestamp).toDate()).calendar(now)
            )}, ${getETAWithMargin(scheduledTo, margin)}`}
            selected
            onSelect={() => null}
          />
        );
      } else
        return (
          <RectangularListItemText
            text={`Previsão: ${getETAWithMargin(shouldBeReady)}`}
            selected
            onSelect={() => null}
          />
        );
    }
  };
  const orderSchedulingUI = () => {
    // real time only
    if (!business.preparationModes?.includes('scheduled')) {
      // adicionar o take away aqui tb
      if (fulfillment === 'delivery') {
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
      } else if (fulfillment === 'take-away') {
        return (
          <View style={{ alignSelf: 'center' }}>
            <Text style={{ ...texts.sm }}>{`Previsão: ${getETAWithMargin(shouldBeReady)}`}</Text>
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
          <Text style={{ color: colors.green600 }} onPress={onCheckSchedules}>
            {t('Agendar horário')}
          </Text>
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
          marginBottom: padding,
        }}
      />
      {orderSchedulingUI()}
    </View>
  );
};
