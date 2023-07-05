import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView } from 'react-native';
import { ApprovedParamList } from '../../types';
import { HowAppJustoWorksContent } from './HowAppJustoWorksContent';
import { HowAppJustoWorksParams } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HowAppJustoWorksParams, 'HowAppJustoWorks'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const HowAppJustoWorks = ({ navigation }: Props) => {
  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
      <HowAppJustoWorksContent navigation={navigation} />
    </ScrollView>
  );
};
