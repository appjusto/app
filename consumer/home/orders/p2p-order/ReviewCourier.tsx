import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';

import RoundedProfileImg from '../../../../common/components/icons/RoundedProfileImg';
import HR from '../../../../common/components/views/HR';
import { halfPadding, screens, texts, colors, padding } from '../../../../common/styles';
import { HomeNavigatorParamList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'ReviewCourier'>;
type ScreenRoute = RouteProp<HomeNavigatorParamList, 'ReviewCourier'>;

export default function () {
  return (
    <View style={{ ...screens.default, flexDirection: 'row', alignItems: 'center' }}>
      <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <RoundedProfileImg />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ ...texts.medium, marginBottom: halfPadding }}>João Paulo</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>No appJusto desde</Text>
          <Text style={{ ...texts.small }}>Setembro, 2020</Text>
        </View>
      </PaddedView>
      <HR height={padding} />
    </View>
  );
}
