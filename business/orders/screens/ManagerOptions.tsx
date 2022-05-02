import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Linking, ScrollView } from 'react-native';
import { ApiContext } from '../../../common/app/context';
import ConfigItem from '../../../common/components/views/ConfigItem';
import { useSegmentScreen } from '../../../common/store/api/track';
import { screens } from '../../../common/styles';
import { confirmLogout } from '../../../common/utils/utils';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import { BusinessNavParamsList } from '../../types';
import { ConfigModal } from '../components/ConfigModal';
type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'ManagerOptions'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'ManagerOptions'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ManagerOptions = ({ navigation, route }: Props) => {
  // context
  const api = useContext(ApiContext);
  // state
  const [visible, setVisible] = React.useState(false);
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
        title={t('Pedidos')}
        subtitle={t('Gerencie seus pedidos')}
        onPress={() => navigation.navigate('BusinessOrders')}
      />
      {/* <ConfigItem
        title={t('Configurações')}
        subtitle={t('Edite as configurações do gerenciador')}
        onPress={() => setVisible(true)}
      /> */}
      <ConfigItem
        title={t('Central de ajuda')}
        subtitle={t('Tire suas dúvidas ou envie uma mensagem')}
        onPress={() => {
          Linking.openURL(AppJustoAssistanceWhatsAppURL); // opening whatsapp chat with our support team
        }}
      />
      <ConfigItem
        title={t('Sobre o AppJusto')}
        subtitle={t('Acesse nossas páginas')}
        onPress={() => {
          navigation.navigate('AboutApp');
        }}
      />
      <ConfigItem
        title={t('Termos de uso e política de privacidade')}
        subtitle={t('Leia os termos de uso do AppJusto')}
        onPress={() => {
          navigation.navigate('Terms');
        }}
      />
      <ConfigItem
        title={t('Sair do App')}
        subtitle={t(
          'Desconecte-se do aplicativo. Para retornar, você precisará confirmar seu e-mail cadastrado'
        )}
        onPress={() => confirmLogout(api)}
      />
      <ConfigModal modalVisible={visible} onModalClose={() => setVisible(false)} />
    </ScrollView>
  );
};
