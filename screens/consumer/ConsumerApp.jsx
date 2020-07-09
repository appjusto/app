import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ConsumerIntro from './intro/ConsumerIntro';
import ConsumerConfirmation from './confirmation/ConsumerConfirmation';
import ConsumerRegister from './register/ConsumerRegister';
import ConsumerHome from './home/ConsumerHome';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import AddressComplete from '../common/AddressComplete';

import BackButton from '../common/BackButton';
import * as fonts from '../../assets/fonts';

const RootNavigator = createStackNavigator();
const UnloggedStack = createStackNavigator();
const LoggedNavigator = createStackNavigator();
const CreateOrderNavigator = createStackNavigator();

function Unlogged() {
  const unloggedOptions = {
    headerTitleStyle: {
      fontFamily: fonts.BarlowMedium,
      fontSize: 16,
      lineHeight: 19,
      color: 'black',
    },
    // headerLeft: () => <BackButton />,
  };
  return (
    <UnloggedStack.Navigator
      initialRouteName='ConsumerIntro'
      screenOptions={unloggedOptions}
    >
      <UnloggedStack.Screen name='ConsumerIntro' component={ConsumerIntro} />
      <UnloggedStack.Screen
        name='ConsumerConfirmation'
        component={ConsumerConfirmation}
        // options={{
        //   headerLeft: <BackButton />
        // }}
      />
      <UnloggedStack.Screen
        name='ConsumerRegister'
        component={ConsumerRegister}
      />
    </UnloggedStack.Navigator>
  );
}

function Logged() {
  return (
    <LoggedNavigator.Navigator>
      <LoggedNavigator.Screen name='ConsumerHome' component={ConsumerHome} />
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
      <RootNavigator.Navigator mode='modal' initialRouteName='Unlogged'>
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
