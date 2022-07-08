import { BusinessSchedule, Order, WithId } from '@appjusto/types';
import { stringify } from '@firebase/util';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RoundedText from '../../../../common/components/texts/RoundedText';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { useObserveBusiness } from '../../../../common/store/api/business/hooks/useObserveBusiness';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { formatDate } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  order: WithId<Order>;
};

export const OrderScheduling = ({ order }: Props) => {
  // ver o lance da "fare" que vai ser mostrada na lista de horas. usaremos o mesmo cálculo aqui de uma entrega
  // normal?

  // ver o dia de hoje e criar uma lista com os próximos 7 (?) dias para o cliente poder selecionar.

  // daqui chamaremos um update order com os dados do agendamento

  // lá fora, na checkout, o componente "Valor total a pagar" precisa responder

  // depois do placeOrder, pra que tela iremos?

  // context
  const getServerTime = useContextGetSeverTime();
  const business = useObserveBusiness(order.business?.id);
  // state
  const [selectedDay, setSelectedDay] = React.useState<Date>();
  // helpers
  const today = getServerTime();
  // starts at the next day
  const getDays = (startDate: Date, daysToAdd: number) => {
    const days: Date[] = [];
    for (let i = 1; i <= daysToAdd; i++) {
      const currentDate = new Date();
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    return days;
  };

  // daySchedule
  // {
  //   "checked": true,
  //   "day": "Terça",
  //   "schedule": Array [
  //     Object {
  //       "from": "0900",
  //       "to": "1400",
  //     },
  //     Object {
  //       "from": "1500",
  //       "to": "2300",
  //     },
  // UI
  const getDayScheduleHours = (date: Date, schedules: BusinessSchedule) => {
    const day = date.getDay();
    const dayIndex = day === 0 ? 6 : day - 1;
    const daySchedule = business?.schedules[dayIndex];
    if (!date || !daySchedule) return null;
    const hours: string[] = [];
    for (
      let startingHour = parseInt(daySchedule.schedule[0].from);
      startingHour < parseInt(daySchedule.schedule[0].to);
      startingHour + 100
    ) {
      hours.push(stringify(startingHour));
    }
    for (
      let startingHour = parseInt(daySchedule.schedule[1].from);
      startingHour < parseInt(daySchedule.schedule[1].to);
      startingHour + 100
    ) {
      hours.push(stringify(startingHour));
    }
    return hours;
  };
  if (!business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  console.log(getDayScheduleHours(today, business?.schedules));
  return (
    <View style={{ ...screens.default, width: '100%' }}>
      <SingleHeader title={t('Escolha quando deseja receber seu pedido')} />
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
      <ScrollView
        horizontal
        style={{ marginTop: padding, paddingLeft: padding }}
        showsHorizontalScrollIndicator={false}
      >
        {getDays(today, 7).map((day, i) => {
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
        })}
      </ScrollView>
      <View style={{ paddingHorizontal: padding, marginVertical: padding }}>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Entregas agendadas serão feitas pela frota AppJusto')}
        </Text>
      </View>
    </View>
  );
};
