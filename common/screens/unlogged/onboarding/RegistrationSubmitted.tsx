import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import PaddedView from '../../../components/containers/PaddedView';
import { screens } from '../../../styles';
import { SocialMediaCard } from '../../home/cards/SocialMediaCard';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'RegistrationSubmitted'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'RegistrationSubmitted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RegistrationSubmitted = ({ navigation, route }: Props) => {
  return (
    <SafeAreaView style={{ ...screens.config }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <PaddedView>
          <Text>CONSUMER PROFILE SUBMITTED SCREEN</Text>
          <SocialMediaCard app="instagram" />
        </PaddedView>
      </ScrollView>
    </SafeAreaView>
  );
};
