import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { ApiContext } from '../../../../common/app/context';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { AppJustoFreshdeskCourierURL } from '../../../../strings/values';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainParamList, 'Profile'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRouteProp = RouteProp<MainParamList, 'Profile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const Stack = createStackNavigator();

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  // side effects
  // tracking
  useSegmentScreen('Profile');
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
            track('courier signing out');
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
          <View style={[screens.config]}>
            <ScrollView scrollIndicatorInsets={{ right: 1 }}>
              <ConfigItem
                title={t('Dados pessoais')}
                subtitle={t('Seu nome, sobrenome, CPF e número do celular')}
                onPress={() => {
                  track('navigating to ProfileEdit');
                  navigation.navigate('ProfileNavigator', { screen: 'ProfileEdit' });
                }}
              />
              <ConfigItem
                title={t('Fotos e documentos')}
                subtitle={t('Sua selfie e imagem do seu documento')}
                onPress={() => {
                  track('navigating to ProfilePhotos');
                  navigation.navigate('ProfileNavigator', { screen: 'ProfilePhotos' });
                }}
              />
              <ConfigItem
                title={t('Dados da sua empresa')}
                subtitle={t('CNPJ, Razão social e endereço da sua empresa')}
                onPress={() => {
                  track('navigating to ProfileCompany');
                  navigation.navigate('ProfileNavigator', { screen: 'ProfileCompany' });
                }}
              />
              <ConfigItem
                title={t('Dados bancários')}
                subtitle={t('Banco, agência e conta corrente da sua empresa')}
                onPress={() => {
                  track('navigating to ProfileBank');
                  navigation.navigate('ProfileNavigator', {
                    screen: 'ProfileBank',
                  });
                }}
              />
              <ConfigItem
                title={t('Escolha sua frota')}
                subtitle={t('Escolha a frota que você faz parte')}
                onPress={() => {
                  track('navigating to ChooseFleet');
                  navigation.navigate('ProfileNavigator', {
                    screen: 'ChooseFleet',
                  });
                }}
              />
              <ConfigItem
                title={t('Central de ajuda')}
                subtitle={t('Tire suas dúvidas ou envie uma mensagem')}
                onPress={() => {
                  track('opening courier freshdesk url');
                  Linking.openURL(AppJustoFreshdeskCourierURL);
                }}
              />
              <ConfigItem
                title={t('Descontos em parceiros')}
                subtitle={t(
                  'Veja as negociações coletivas que o AppJusto conseguir para a categoria'
                )}
                onPress={() => {
                  track('navigating to PartnersAndDiscounts');
                  navigation.navigate('ProfileNavigator', { screen: 'PartnersAndDiscounts' });
                }}
              />
              <ConfigItem
                title={t('Sobre o AppJusto')}
                subtitle={t('Acesse nossas páginas')}
                onPress={() => {
                  track('navigating to AboutApp');
                  navigation.navigate('ProfileNavigator', {
                    screen: 'AboutApp',
                  });
                }}
              />
              <ConfigItem
                title={t('Termos de uso e política de privacidade')}
                subtitle={t('Leia os termos de uso do AppJusto')}
                onPress={() => {
                  track('navigating to Terms');
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
                onPress={() => {
                  track('navigating to ProfileErase');
                  navigation.navigate('ProfileNavigator', { screen: 'ProfileErase' });
                }}
              />
            </ScrollView>
          </View>
        )}
      />
    </Stack.Navigator>
  );
}
