import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNotificationToken } from '../../../common/hooks/useNotificationToken';
import { useSegmentScreen } from '../../../common/store/api/track';
import { screens } from '../../../common/styles';
import { HowAppJustoWorksContent } from '../../approved/main/howitworks/HowAppJustoWorksContent';
import { SituationHeader } from '../../common/situation-header/SituationHeader';
import { UnapprovedParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'ProfileSubmitted'>;
type ScreenRouteProp = RouteProp<UnapprovedParamList, 'ProfileSubmitted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ProfileSubmitted = ({ navigation }: Props) => {
  // side effects
  useNotificationToken();
  useSegmentScreen('Profile Submitted');
  // UI
  return (
    <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
      <View>
        <SituationHeader variant="approved" />
        <HowAppJustoWorksContent navigation={navigation} />
      </View>
    </ScrollView>
  );
};
