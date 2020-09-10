import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

import { ApiContext } from '../../../common/app/context';
import ConfigItem from '../../../common/components/ConfigItem';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { signOut } from '../../../common/store/user/actions';
import { colors, texts, screens, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'Profile'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'Profile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);

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
          onPress: () => signOut(api),
        },
      ]
    );
  };

  // UI
  return (
    <View style={styles.screen}>
      <ConfigItem
        title={t('Seus dados')}
        subtitle={t('Edite seus dados pessoais')}
        onPress={() => navigation.navigate('ProfileEdit', { allowPartialSave: false })}
      />
      <ConfigItem
        title={t('Dados bancários')}
        subtitle={t('Edite seus dados pessoais')}
        onPress={() => navigation.navigate('Bank')}
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

      <View style={{ flex: 1 }} />

      <DefaultButton title={t('Sair da conta')} onPress={confirmLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...screens.lightGrey,
    paddingBottom: padding,
  },
  container: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomColor: colors.grey,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  texts: {},
  black: {
    paddingBottom: 8,
    ...texts.default,
  },
  darkGrey: {
    paddingBottom: 16,
    ...texts.default,
    color: colors.darkGrey,
  },
  button: {
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    paddingBottom: 28,
  },
});
