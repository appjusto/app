import { Business, Order, WithId } from '@appjusto/types';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RectangularListItemText } from '../../../../common/components/texts/RectangularListItemText';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { colors, padding, screens, texts } from '../../../../common/styles';
import { getETAWithMargin } from '../../../../common/utils/formatters/datetime';
import { t } from '../../../../strings';

type Props = {
  order: WithId<Order>;
  business: WithId<Business> | undefined;
  onCheckScheduleSlots: () => void;
  scheduleSlots: Date[][];
};

export const OrderScheduling = ({
  order,
  business,
  onCheckScheduleSlots,
  scheduleSlots,
}: Props) => {
  // ver o lance da "fare" que vai ser mostrada na lista de horas. usaremos o mesmo cálculo aqui de uma entrega
  // normal?

  // ver o dia de hoje e criar uma lista com os próximos 7 (?) dias para o cliente poder selecionar.

  // daqui chamaremos um update order com os dados do agendamento

  // lá fora, na checkout, o componente "Valor total a pagar" precisa responder

  // context
  const getServerTime = useContextGetSeverTime();
  // state
  const [selectedDay, setSelectedDay] = React.useState<Date>();
  const today = getServerTime();

  const { origin, destination, route, arrivals } = order;
  const eTA =
    route?.distance && arrivals?.destination?.estimate
      ? `${t('Previsão:')} ${getETAWithMargin(arrivals.destination.estimate)}`
      : null;

  if (!business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  // helpers
  const canDeliver = business.fulfillment?.includes('delivery');
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
          justifyContent: eTA ? 'space-between' : 'flex-end',
          paddingHorizontal: padding,
        }}
      >
        {eTA ? (
          <View>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{eTA}</Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={onCheckScheduleSlots}>
          <Text style={{ ...texts.sm, color: colors.green600 }}>{t('Ver horários')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={{ marginTop: padding, paddingLeft: padding }}
        showsHorizontalScrollIndicator={false}
      >
        {/* the first item of the list shows the realtime delivery time. hard coded for now */}
        <RectangularListItemText text={t('Hoje, 30 - 60 minutos')} selected onSelect={() => null} />
        {/* {getDays(today, 7).map((day, i) => {
          return (
            <TouchableOpacity
              style={{ marginRight: halfPadding }}
              onPress={() => setSelectedDay(day)}
              key={i}
            >
              <RoundedText noBorder backgroundColor={colors.green100}>
                {formatDate(day)}
              </RoundedText>
            </TouchableOpacity>
          );
        })} */}
      </ScrollView>
    </View>
  );
};
