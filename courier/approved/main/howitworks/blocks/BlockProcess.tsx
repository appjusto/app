import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView } from 'react-native';
import { ApprovedParamList } from '../../../types';
import { HowAppJustoWorksParams } from '../types';
import { BlockProcessContent } from './BlockProcessContent';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HowAppJustoWorksParams, 'BlockProcess'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const BlockProcess = ({ navigation }: Props) => {
  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
      <BlockProcessContent variant="how-it-works" />
    </ScrollView>
  );
};
