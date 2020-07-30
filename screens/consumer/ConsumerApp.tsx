import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';

import useAuth, { AuthState } from '../../hooks/useAuth';
import AddressComplete from '../common/AddressComplete';
import ConsumerConfirmation from './confirmation/ConsumerConfirmation';
import ConsumerHistory from './history/ConsumerHistory';
import ConsumerHome from './home/ConsumerHome';
import ConsumerIntro from './intro/ConsumerIntro';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import ConsumerProfile from './profile/ConsumerProfile';
import EraseConfirmed from './profile/EraseConfirmed';
import ProfileEdit from './profile/ProfileEdit';
import ProfileErase from './profile/ProfileErase';
import ConsumerRegistration from './registration/ConsumerRegistration';
import Terms from './terms-of-use/Terms';

const UnloggedStack = createStackNavigator();
function Unlogged() {
  return (
    <UnloggedStack.Navigator initialRouteName="ConsumerIntro">
      <UnloggedStack.Screen
        name="ConsumerIntro"
        component={ConsumerIntro}
        options={{ headerShown: false, title: '' }}
      />
      <UnloggedStack.Screen
        name="ConsumerConfirmation"
        component={ConsumerConfirmation}
        options={{ title: '' }}
      />
      <UnloggedStack.Screen
        name="ConsumerRegistration"
        component={ConsumerRegistration}
        options={{ title: '' }}
      />
      <UnloggedStack.Screen name="Terms" component={Terms} options={{ title: '' }} />
      {/* <UnloggedStack.Screen name='ConsumerHome' component={ConsumerHome} /> */}
    </UnloggedStack.Navigator>
  );
}

const HistoryStack = createStackNavigator();
function History() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="ConsumerHistory" component={ConsumerHistory} />
    </HistoryStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
const Profile = () => {
  return (
    <ProfileStack.Navigator initialRouteName="ConsumerProfile">
      <ProfileStack.Screen name="ConsumerProfile" component={ConsumerProfile} />
      <ProfileStack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: 'Seus dados' }}
      />
      <ProfileStack.Screen
        name="ProfileErase"
        component={ProfileErase}
        options={{ title: 'Excluir minha conta' }}
      />
      <ProfileStack.Screen name="EraseConfirmed" component={EraseConfirmed} />
    </ProfileStack.Navigator>
  );
};

const HomeStack = createStackNavigator();
function Home() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="ConsumerHome" component={ConsumerHome} />
      <HomeStack.Screen name="CreateOrderP2P" component={CreateOrderP2P} />
    </HomeStack.Navigator>
  );
}

const LoggedNavigator = createBottomTabNavigator();
function Logged() {
  return (
    <LoggedNavigator.Navigator>
      <LoggedNavigator.Screen name="Home" component={Home} />
      <LoggedNavigator.Screen name="ConsumerHistory" component={History} />
      <LoggedNavigator.Screen name="Profile" component={Profile} options={{ title: 'Sua conta' }} />
    </LoggedNavigator.Navigator>
  );
}

const RootNavigator = createStackNavigator();
export default function () {
  // side effects
  const [authState] = useAuth();
  // UI
  // show nothing while checking credentials
  if (authState === AuthState.Checking || authState === AuthState.SigningIn) return null;

  // switch between logged and unlogged stacks
  const initialRouteName = authState === AuthState.SignedIn ? 'Logged' : 'Unlogged';
  return (
    <RootNavigator.Navigator mode="modal" initialRouteName={initialRouteName}>
      <RootNavigator.Screen
        name="Unlogged"
        component={Unlogged}
        options={{
          headerShown: false,
        }}
      />
      <RootNavigator.Screen name="Logged" component={Logged} />
      {/* <RootNavigator.Screen name="CreateOrder" component={CreateOrder} /> */}
      <RootNavigator.Screen name="AddressComplete" component={AddressComplete} />
    </RootNavigator.Navigator>
  );
}
