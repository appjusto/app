import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useCallback } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { ApiContext } from '../../../../common/app/context';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import { signOut } from '../../../../common/store/user/actions';
import { screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { CourierProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'Profile'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'Profile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);

  // handlers
  const confirmLogout = useCallback(() => {
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
          onPress: () => signOut(api),
        },
      ]
    );
  }, []);

  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView>
        <ConfigItem
          title={t('Seus dados')}
          subtitle={t('Edite seus dados pessoais')}
          onPress={() => navigation.navigate('ProfileEdit')}
        />
        <ConfigItem
          title={t('Dados da sua empresa')}
          subtitle={t('Preencha os dados da sua empresa ou MEI')}
          onPress={() => navigation.navigate('ProfileCompany')}
        />
        <ConfigItem
          title={t('Fotos e documentos')}
          subtitle={t('Edite sua selfie e documentos enviados')}
          onPress={() => navigation.navigate('ProfilePhotos')}
        />
        <ConfigItem
          title={t('Dados bancários')}
          subtitle={t('Edite seus dados pessoais')}
          onPress={() => navigation.navigate('BankNavigator')}
        />
        <ConfigItem
          title={t('Escolha sua frota')}
          subtitle={t('Edite a frota que você faz parte')}
          onPress={() => navigation.navigate('FleetNavigator')}
        />
        <ConfigItem
          title={t('Termos de uso e política de privacidade')}
          subtitle={t('Leia os termos de uso do AppJusto')}
          onPress={() => navigation.navigate('Terms')}
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
          onPress={() => navigation.navigate('ProfileErase')}
        />
      </ScrollView>
    </View>
  );
}
