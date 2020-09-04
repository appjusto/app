import React, { useMemo } from 'react';
import { View, SectionList, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/views/PaddedView';
import { getOrdersSummary } from '../../../common/store/order/selectors';
import { screens, texts, padding, colors } from '../../../common/styles';

export default function () {
  const ordersSummary = useSelector(getOrdersSummary);

  const sections = useMemo(() => {
    const { years, months, monthSummary } = ordersSummary;
    console.log(ordersSummary);
    return years.map((year) => ({
      title: year,
      data: months.filter((month) => month.startsWith(`${year}/`)),
    }));
  }, [ordersSummary]);

  return (
    <View style={{ ...screens.default }}>
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item}
        renderSectionHeader={({ section }) => (
          <PaddedView
            style={{ flexDirection: 'row', borderBottomColor: colors.grey, borderBottomWidth: 1 }}
          >
            <Image source={icons.calendar} />
            <Text style={{ ...texts.medium, marginLeft: padding }}>{section.title}</Text>
          </PaddedView>
        )}
        renderItem={({ item }) => (
          <PaddedView>
            <Text style={{ ...texts.medium }}>{item}</Text>
          </PaddedView>
        )}
      />
    </View>
  );
}
