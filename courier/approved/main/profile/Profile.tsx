import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { ApiContext } from '../../../../common/app/context';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { useSegmentScreen } from '../../../../common/store/api/track';
import { screens } from '../../../../common/styles';
import { confirmLogout } from '../../../../common/utils/utils';
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
                onPress={() =>
                  navigation.navigate('ProfileNavigator', { screen: 'CommonProfileEdit' })
                }
              />
              <ConfigItem
                title={t('Fotos e documentos')}
                subtitle={t('Sua selfie e imagem do seu documento')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', { screen: 'ProfilePhotos' });
                }}
              />
              <ConfigItem
                title={t('Dados da sua empresa')}
                subtitle={t('CNPJ, Razão social e endereço da sua empresa')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', { screen: 'ProfileCompany' });
                }}
              />
              <ConfigItem
                title={t('Dados bancários')}
                subtitle={t('Banco, agência e conta corrente da sua empresa')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', {
                    screen: 'ProfileBank',
                  });
                }}
              />
              <ConfigItem
                title={t('Escolha sua frota')}
                subtitle={t('Escolha a frota que você faz parte')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', {
                    screen: 'ChooseFleet',
                  });
                }}
              />
              <ConfigItem
                title={t('Notificações')}
                subtitle={t('Escolha as notificações que você quer receber no AppJusto')}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', {
                    screen: 'NotificationPreferences',
                  });
                }}
              />
              <ConfigItem
                title={t('Central de ajuda')}
                subtitle={t('Tire suas dúvidas ou envie uma mensagem')}
                onPress={() => {
                  Linking.openURL(AppJustoFreshdeskCourierURL);
                }}
              />
              <ConfigItem
                title={t('Descontos em parceiros')}
                subtitle={t(
                  'Veja as negociações coletivas que o AppJusto conseguir para a categoria'
                )}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', { screen: 'PartnersAndDiscounts' });
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
                title={t('Excluir minha conta')}
                subtitle={t(
                  'Todos os seus dados serão apagados do nosso sistema e você não fará mais parte do AppJusto'
                )}
                onPress={() => {
                  navigation.navigate('ProfileNavigator', { screen: 'ProfileErase' });
                }}
              />
              <ConfigItem
                title={t('Sair do App')}
                subtitle={t(
                  'Desconecte-se do aplicativo. Para retornar, você precisará confirmar seu e-mail cadastrado'
                )}
                bottomBorder={false}
                onPress={() => confirmLogout(api)}
              />
            </ScrollView>
          </View>
        )}
      />
    </Stack.Navigator>
  );
}
