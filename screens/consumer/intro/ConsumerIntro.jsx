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
  Platform
} from 'react-native';

import DefaultInput from '../../common/DefaultInput';
import DefaultButton from '../../common/DefaultButton';
import { t } from '../../../strings';
import { logoWhite } from '../../../assets/icons';
import * as fonts from '../../../assets/fonts';

export default function ConsumerIntro() {
  const [phone, setPhone] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={styles.greenCircle} />
          <View style={styles.imageContainer}>
            <Image source={logoWhite} style={styles.logo} />
          </View>
          <View style={styles.containerBigText}>
            <Text style={styles.BigText}>{t('weAre')}</Text>
          </View>
          <View style={styles.containerMediumText}>
            <Text style={styles.mediumText}>{t('platform')}</Text>
          </View>
          <View style={styles.containerMediumText}>
            <Text style={styles.mediumText}>{t('platform')}</Text>
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
            <DefaultButton disabled={phone.length === 0} title={t('enter')} />
          </DefaultInput>
          <TouchableOpacity style={styles.tb}>
            <View style={styles.enterEmail}>
              <View style={styles.littleCircle} />
              <Text style={styles.emailText}>{t('yourEmail')}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomBox}>
              <Text style={styles.bottomText}></Text>
            </View>
            {/* <RegularButton isGreen></RegularButton> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  greenCircle: {
    width: 160,
    height: 160,
    borderRadius: 160 / 2,
    backgroundColor: '#78E08F',
    alignSelf: 'flex-end',
  },
  imageContainer: {
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
  BigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
    fontFamily: fonts.medium,
  },
  containerMediumText: {
    width: '85%',
    height: 58,
    alignItems: 'flex-start',
    marginVertical: 16,
    // marginRight: 24,
  },
  mediumText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#697667',
    fontFamily: fonts.medium,
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
    // bottom: 7,
  },
  emailText: {
    fontSize: 15,
    lineHeight: 18,
    marginLeft: 4,
    fontFamily: fonts.medium,
  },
  bottomContainer: {},
  bottomBox: {},
  bottomText: {},
});
