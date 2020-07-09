import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { t } from '../../../strings';
import { logoWhite, arrow } from '../../../assets/icons';
import * as fonts from '../../../assets/fonts';
import { colors } from '../../common/styles';

export default function ConsumerIntro({ navigation }) {
  const [phone, setPhone] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.screen}>
          <View style={styles.touchable}>
            <View style={styles.greenCircle} />
            <View style={styles.imageContainer}>
              <Image source={logoWhite} style={styles.logo} />
            </View>
            <View style={styles.containerBigText}>
              <Text style={styles.bigText}>{t('weAre')}</Text>
            </View>
            <View style={styles.containerMediumText}>
              <Text style={styles.mediumText}>{t('platform')}</Text>
            </View>
            <DefaultInput
              value={phone}
              title={t('access')}
              placeholder={t('cellPhone')}
              onChangeText={setPhone}
              keyboardType='numeric'
              blurOnSubmit
            >
              <DefaultButton
                disabled={phone.length === 0}
                title={t('enter')}
                onPress={
                  () => navigation.navigate('ConsumerConfirmation', { path: 'sms' })
                }
              />
            </DefaultInput>
            <TouchableOpacity
              style={styles.tb}
              onPress={() => navigation.navigate('ConsumerConfirmation', { path: 'email' })}
            >
              <View style={styles.enterEmail}>
                <View style={styles.littleCircle} />
                <Text style={styles.emailText}>{t('yourEmail')}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.bottomBox}>
                <Text style={styles.bottomText} numberOfLines={2}>
                  {t('part')}
                  <View style={styles.arrow}>
                    <Image source={arrow} />
                  </View>
                </Text>
              </View>
              <DefaultButton title={t('register')} onPress={() => navigation.navigate('ConsumerRegister')} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#fff',
  },
  touchable: {
    marginHorizontal: 16,
    marginTop: 16,
    flex: 1,
  },
  greenCircle: {
    width: 160,
    height: 160,
    borderRadius: 160 / 2,
    backgroundColor: '#78E08F',
    alignSelf: 'flex-end',
  },
  imageContainer: {
    height: 74,
    marginTop: 41,
  },
  logo: {
    width: '46,5%',
    height: 74,
  },
  containerBigText: {
    width: '100%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 16,
  },
  bigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
    fontFamily: fonts.BarlowMedium,
  },
  containerMediumText: {
    width: '85%',
    height: 58,
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  mediumText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#697667',
    fontFamily: fonts.BarlowMedium,
  },
  tb: {
    alignSelf: 'center',
    height: 18,
    marginTop: 16,
  },
  enterEmail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  littleCircle: {
    height: 4,
    width: 4,
    borderRadius: 4 / 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#63B745',
  },
  emailText: {
    fontSize: 15,
    lineHeight: 18,
    marginLeft: 4,
    fontFamily: fonts.BarlowMedium,
  },
  bottomContainer: {
    top: 550,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    backgroundColor: colors.lightGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 22,
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
    // alignSelf: 'flex-end',
  },
  innerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  bottomBox: {
    width: 150,
  },
  bottomText: {
    fontFamily: fonts.BarlowMedium,
    fontSize: 15,
    lineHeight: 18,
  },
  arrow: {
    width: 10.38,
    height: 3.51,
  },
});
