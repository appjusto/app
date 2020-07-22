import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import GoButton from '../../common/GoButton';
import { colors, texts, screens } from '../../common/styles';
import { t } from '../../../strings';

const ConsumerProfile = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Seus dados')}</Text>
            <Text style={styles.darkGrey}>
              {t('Edite seus dados pessoais')}
            </Text>
          </View>
          <View style={styles.button}>
            <GoButton />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text style={styles.black}>{t('Formas de pagamento')}</Text>
            <Text style={styles.darkGrey}>
              {t('Edite suas formas de pagamento')}
            </Text>
          </View>
          <View style={styles.button}>
            <GoButton />
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
            <Text style={styles.black}>
              {t('Termos de uso e política de privacidade')}
            </Text>
            <Text style={styles.darkGrey}>
              {t('Leia os termos de uso do AppJusto')}
            </Text>
          </View>
          <View style={styles.button}>
            <GoButton />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...screens.lightGrey,
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

export default ConsumerProfile;
