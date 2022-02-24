import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import { ApiContext } from '../../../common/app/context';
import ConfigItem from '../../../common/components/views/ConfigItem';
import { useSegmentScreen } from '../../../common/store/api/track';
import { screens } from '../../../common/styles';
import { confirmLogout } from '../../../common/utils/utils';
import { t } from '../../../strings';
import { LoggedBusinessNavParamsList } from '../../types';
type ScreenNavigationProp = StackNavigationProp<LoggedBusinessNavParamsList, 'ManagerOptions'>;
type ScreenRouteProp = RouteProp<LoggedBusinessNavParamsList, 'ManagerOptions'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ManagerOptions = () => {
  // context
  // TODO: connect to the right context
  const api = useContext(ApiContext);
  // tracking
  useSegmentScreen('ManagerOptions');
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <ConfigItem
        title={t('Central de ajuda')}
        subtitle={t('Tire suas dúvidas ou envie uma mensagem')}
        // onPress={() => {
        //   track('opening FreshdeskConsumerURL');
        //   Linking.openURL(AppJustoFreshdeskConsumerURL);
        // }}
        onPress={() => null}
      />
      <ConfigItem
        title={t('Sobre o AppJusto')}
        subtitle={t('Acesse nossas páginas')}
        // onPress={() => {
        //   navigation.navigate('ProfileNavigator', {
        //     screen: 'AboutApp',
        //   });
        // }}
        onPress={() => null}
      />
      <ConfigItem
        title={t('Termos de uso e política de privacidade')}
        subtitle={t('Leia os termos de uso do AppJusto')}
        // onPress={() => {
        //   navigation.navigate('ProfileNavigator', { screen: 'Terms' });
        // }}
        onPress={() => null}
      />
      <ConfigItem
        title={t('Sair do App')}
        subtitle={t(
          'Desconecte-se do aplicativo. Para retornar, você precisará confirmar seu e-mail cadastrado'
        )}
        onPress={() => confirmLogout(api)}
      />
    </ScrollView>
  );
};
