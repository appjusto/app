import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ConsumerIntro from './intro/ConsumerIntro';
import ConsumerConfirmation from './confirmation/ConsumerConfirmation';
import ConsumerRegistration from './registration/ConsumerRegistration';
import Terms from './terms-of-use/Terms';
import ConsumerHome from './home/ConsumerHome';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import AddressComplete from '../common/AddressComplete';
import ConsumerProfile from './profile/ConsumerProfile';
import ProfileEdit from './profile/ProfileEdit';
import ProfileErase from './profile/ProfileErase';
import EraseConfirmed from './profile/EraseConfirmed';
import ConsumerHistory from './history/ConsumerHistory';

const RootNavigator = createStackNavigator();
const UnloggedStack = createStackNavigator();
const LoggedNavigator = createBottomTabNavigator();
const CreateOrderNavigator = createStackNavigator();
const ProfileStack = createStackNavigator();
const HistoryStack = createStackNavigator();

function History() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name='ConsumerHistory' component={ConsumerHistory} />
    </HistoryStack.Navigator>
  );
}

const Profile = () => {
  return (
    <ProfileStack.Navigator initialRouteName={ConsumerProfile}>
      <ProfileStack.screen name='ConsumerProfile' component={ConsumerProfile} />
      <ProfileStack.screen name='ProfileEdit' component={ProfileEdit} />
      <ProfileStack.screen name='ProfileErase' component={ProfileErase} />
      <ProfileStack.screen name='EraseConfirmed' component={EraseConfirmed} />
    </ProfileStack.Navigator>
  );
};

function Unlogged() {
  return (
    <UnloggedStack.Navigator
      initialRouteName='ConsumerIntro'
      // screenOptions={unloggedOptions}
    >
      <UnloggedStack.Screen
        name='ConsumerIntro'
        component={ConsumerIntro}
        // options={{ title: 'Intro' }}
      />
      <UnloggedStack.Screen
        name='ConsumerConfirmation'
        component={ConsumerConfirmation}
        options={{ title: 'Confirme seu acesso' }}
      />
      <UnloggedStack.Screen
        name='ConsumerRegistration'
        component={ConsumerRegistration}
      />
      <UnloggedStack.Screen name='Terms' component={Terms} />
      {/* <UnloggedStack.Screen name='ConsumerHome' component={ConsumerHome} /> */}
    </UnloggedStack.Navigator>
  );
}

function Logged() {
  return (
    <LoggedNavigator.Navigator>
      <LoggedNavigator.Screen name='ConsumerHome' component={ConsumerHome} />
      <LoggedNavigator.Screen
        name='ConsumerHistory'
        component={ConsumerHistory}
      />
      <LoggedNavigator.Screen
        name='Profile'
        component={Profile}
        options={{ title: 'Sua conta' }}
      />
    </LoggedNavigator.Navigator>
  );
}

function CreateOrder() {
  return (
    <CreateOrderNavigator.Navigator>
      <CreateOrderNavigator.Screen
        name='CreateOrderP2P'
        component={CreateOrderP2P}
      />
    </CreateOrderNavigator.Navigator>
  );
}

export default function () {
  return (
    <NavigationContainer>
      <RootNavigator.Navigator mode='modal' initialRouteName='ConsumerIntro'>
        <RootNavigator.Screen name='Unlogged' component={Unlogged} />
        <RootNavigator.Screen name='Logged' component={Logged} />
        <RootNavigator.Screen name='CreateOrder' component={CreateOrder} />
        <RootNavigator.Screen
          name='AddressComplete'
          component={AddressComplete}
        />
      </RootNavigator.Navigator>
    </NavigationContainer>
  );
}
