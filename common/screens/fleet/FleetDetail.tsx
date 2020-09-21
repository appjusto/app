import { BaseRouter, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet } from 'appjusto-types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { HomeNavigatorParamList } from '../../../consumer/home/types';
import PaddedView from '../../components/containers/PaddedView';
import { screens, texts } from '../../styles';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'FleetDetail'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'FleetDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  const { fleet } = route.params;
  return (
    <View style={[screens.configScreen]}>
      <ScrollView>
        <PaddedView>
          <Text style={[texts.big]}>{fleet.name}</Text>
        </PaddedView>
      </ScrollView>
    </View>
  );
}
