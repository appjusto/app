import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import { defaultScreenOptions } from '../common/screens/options';
import { getManager } from '../common/store/business/selectors';
import { colors, screens } from '../common/styles';
import { t } from '../strings';
import { BusinessAppContext } from './BusinessAppContext';
import { BusinessPending } from './orders/screens/BusinessPending';
import { UnnaprovedBusinessParamsList } from './types';

const Stack = createStackNavigator<UnnaprovedBusinessParamsList>();

export const UnnaprovedBusinessNavigator = () => {
  // context
  const { business } = React.useContext(BusinessAppContext);
  const manager = useSelector(getManager);

  // UI
  if (!business || !manager) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="BusinessPending"
        component={BusinessPending}
        options={{ title: t('Cadastro pendente') }}
      />
    </Stack.Navigator>
  );
};
