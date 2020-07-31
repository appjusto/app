import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useAuth, { AuthState } from '../../hooks/useAuth';
import { showToast } from '../../store/ui/actions';
import { t } from '../../strings';
// import { userDataPending } from '../../utils/validators';
import AddressComplete from '../common/AddressComplete';
import SignInFeedback from '../welcome/SignInFeedback';
import WelcomeScreen from '../welcome/WelcomeScreen';
import ConsumerHistory from './history/ConsumerHistory';
import ConsumerHome from './home/ConsumerHome';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import ConsumerProfile from './profile/ConsumerProfile';
import EraseConfirmed from './profile/EraseConfirmed';
import ProfileEdit from './profile/ProfileEdit';
import ProfileErase from './profile/ProfileErase';
// import ConsumerRegistration from './registration/ConsumerRegistration';
import Terms from './terms-of-use/Terms';
import { UnloggedStackParamList, HomeStackParamList } from './types';

const UnloggedStack = createStackNavigator<UnloggedStackParamList>();
function Unlogged() {
  return (
    <UnloggedStack.Navigator>
      <UnloggedStack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ headerShown: false, title: '' }}
      />
      <UnloggedStack.Screen
        name="SignInFeedback"
        component={SignInFeedback}
        options={{ title: t('Verifique seu e-mail') }}
      />
      {/* <UnloggedStack.Screen
        name="ConsumerRegistration"
        component={ConsumerRegistration}
        options={{ title: '' }}
      /> */}
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

const HomeStack = createStackNavigator<HomeStackParamList>();
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
  // context
  const dispatch = useDispatch();

  // side effects
  const [authState, user] = useAuth();
  useEffect(() => {
    if (authState === AuthState.InvalidCredentials) {
      dispatch(showToast(t('Sua sessão expirou. Faça login novamente.')));
    }
  }, [authState, user]);

  // UI
  // show nothing while checking for credentials
  if (
    authState === AuthState.CheckingPreviousSession ||
    authState === AuthState.CheckingDeeplink ||
    authState === AuthState.SigningIn
  )
    return null;

  // unlogged stack
  // (or logged but before completed the signin)
  // if (authState !== AuthState.SignedIn || userDataPending(user)) {
  if (authState !== AuthState.SignedIn) {
    return (
      <RootNavigator.Navigator mode="modal">
        <RootNavigator.Screen
          name="Unlogged"
          component={Unlogged}
          options={{
            headerShown: false,
          }}
        />
      </RootNavigator.Navigator>
    );
  }

  // logged stack
  return (
    <RootNavigator.Navigator mode="modal">
      <RootNavigator.Screen name="Logged" component={Logged} />
      {/* <RootNavigator.Screen name="CreateOrder" component={CreateOrder} /> */}
      <RootNavigator.Screen name="AddressComplete" component={AddressComplete} />
    </RootNavigator.Navigator>
  );
}
