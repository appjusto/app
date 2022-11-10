import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { defaultScreenOptions } from '../../common/screens/options';
import { CommonProfileRejected } from '../../common/screens/profile/CommonProfileRejected';
import ProfileBlocked from '../../common/screens/profile/ProfileBlocked';
import { ProfileRejectedFeedback } from '../../common/screens/profile/ProfileRejectedFeedback';
import { getConsumer } from '../../common/store/consumer/selectors';
import ProfilePhotos from '../../courier/approved/main/profile/photos/ProfilePhotos';
import { t } from '../../strings';

export type UnapprovedConsumerParamsList = {
  ProfileBlocked: undefined;
  CommonProfileRejected: undefined;
  ProfilePhotos: undefined;
  ProfileRejectedFeedback: undefined;
};

const Stack = createStackNavigator<UnapprovedConsumerParamsList>(); // TODO: add param list

export const UnapprovedConsumerNavigator = () => {
  // redux
  const consumer = useSelector(getConsumer)!;
  // helpers
  let initialRouteName: 'ProfileBlocked' | 'CommonProfileRejected' | undefined = undefined;
  if (consumer.situation === 'blocked' || consumer.situation === 'deleted')
    initialRouteName = 'ProfileBlocked';
  else initialRouteName = 'CommonProfileRejected';
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName={initialRouteName}>
      <Stack.Screen
        name="ProfileBlocked"
        component={ProfileBlocked}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommonProfileRejected"
        component={CommonProfileRejected}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePhotos"
        component={ProfilePhotos}
        options={{ title: t('Fotos e Documentos') }}
      />
      <Stack.Screen
        name="ProfileRejectedFeedback"
        component={ProfileRejectedFeedback}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
