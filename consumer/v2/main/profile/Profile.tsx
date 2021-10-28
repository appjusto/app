import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { ApiContext } from '../../../../common/app/context';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { AppJustoFreshdeskConsumerURL } from '../../../../strings/values';
import { LoggedNavigatorParamList } from '../../types';
import { MainNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'Profile'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;

type ScreenRouteProp = RouteProp<MainNavigatorParamList, 'Profile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const Stack = createStackNavigator();
export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  // tracking
  useSegmentScreen('consumer Profile');
  // handlers
  const confirmLogout = () => {
    Alert.alert(
      t('Sair da conta'),
      t(
        'Sua conta não será excluída mas você precisará fazer login novamente para continuar usando o App.'
      ),
      [
        {
          text: t('Cancelar'),
          style: 'cancel',
        },
        {
          text: t('Confirmar'),
          style: 'destructive',
          onPress: () => {
            track('signing out');
            api.signOut();
          },
        },
      ]
    );
  };

  // UI
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="Profile"
        options={{ title: 'Seus dados' }}
        children={() => (
          <View style={{ ...screens.config }}>
            <ScrollView scrollIndicatorInsets={{ right: 1 }}>
              <ConfigItem
                title={t('Seus dados')}
                subtitle={t('Edite seus dados pessoais')}
                onPress={() =>
                  navigation.navigate('ProfileNavigator', { screen: 'CommonProfileEdit' })
                }
              />
              <ConfigItem
                title={t('Formas de pagamento')}
                subtitle={t('Edite suas formas de pagamento')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', { screen: 'ProfilePaymentMethods' });
                }}
              />
              <ConfigItem
                title={t('Central de ajuda')}
                subtitle={t('Tire suas dúvidas ou envie uma mensagem')}
                onPress={() => {
                  track('opening FreshdeskConsumerURL');
                  Linking.openURL(AppJustoFreshdeskConsumerURL);
                }}
              />
              <ConfigItem
                title={t('Sobre o AppJusto')}
                subtitle={t('Acesse nossas páginas')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', {
                    screen: 'AboutApp',
                  });
                }}
              />
              <ConfigItem
                title={t('Termos de uso e política de privacidade')}
                subtitle={t('Leia os termos de uso do AppJusto')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', { screen: 'Terms' });
                }}
              />
              <ConfigItem
                title={t('Sair do App')}
                subtitle={t(
                  'Desconecte-se do aplicativo. Para retornar, você precisará confirmar seu e-mail cadastrado'
                )}
                onPress={confirmLogout}
              />
              <ConfigItem
                title={t('Excluir minha conta')}
                subtitle={t(
                  'Todos os seus dados serão apagados do nosso sistema e você não fará mais parte do AppJusto'
                )}
                bottomBorder={false}
                onPress={() => navigation.navigate('ProfileNavigator', { screen: 'ProfileErase' })}
              />
            </ScrollView>
          </View>
        )}
      />
    </Stack.Navigator>
  );
}
