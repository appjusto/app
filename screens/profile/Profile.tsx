import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { signOut } from '../../store/user/actions';
import { t } from '../../strings';
import { ApiContext } from '../app/context';
import ArrowBox from '../common/ArrowBox';
import DefaultButton from '../common/DefaultButton';
import { colors, texts, screens, padding } from '../common/styles';

export default function () {
  // context
  const navigation = useNavigation();
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
      <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Seus dados')}</Text>
            <Text style={styles.darkGrey}>{t('Edite seus dados pessoais')}</Text>
          </View>
          <View style={styles.button}>
            <ArrowBox />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Formas de pagamento')}</Text>
            <Text style={styles.darkGrey}>{t('Edite suas formas de pagamento')}</Text>
          </View>
          <View style={styles.button}>
            <ArrowBox />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Unlogged', { screen: 'Terms' });
        }}
      >
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Termos de uso e política de privacidade')}</Text>
            <Text style={styles.darkGrey}>{t('Leia os termos de uso do AppJusto')}</Text>
          </View>
          <View style={styles.button}>
            <ArrowBox />
          </View>
        </View>
      </TouchableOpacity>

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
