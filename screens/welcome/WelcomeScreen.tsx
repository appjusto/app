import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext, useCallback } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { logoWhite, illustration } from '../../assets/icons';
import { signInWithEmail } from '../../store/actions/user';
import { getEnv } from '../../store/config/selectors';
import { showToast } from '../../store/ui/actions';
import { t } from '../../strings';
import { validateEmail } from '../../utils/validators';
import { ApiContext } from '../app/context';
import AvoidingView from '../common/AvoidingView';
import CheckField from '../common/CheckField';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import { colors, texts, padding, screens } from '../common/styles';

export default function () {
  // context
  const api = useContext(ApiContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // state
  const dev = useSelector(getEnv) === 'development';
  const [email, setEmail] = useState(dev ? 'pdandradeb@gmail.com' : '');
  const [acceptedTerms, setAcceptTerms] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);

  // handlers
  const signInHandler = useCallback(async () => {
    if (validateEmail(email).status === 'ok') {
      dispatch(showToast(t('Enviando link de autenticação para o seu e-mail...')));
      setSendingLink(true);
      await signInWithEmail(api)(email);
      navigation.navigate('SignInFeedback', { email });
    } else {
      // TODO: handle error
    }
  }, [email]);

  // UI
  return (
    <View style={[screens.default, { marginBottom: 0 }]}>
      <View style={{ flex: 1 }}>
        <AvoidingView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={{ paddingHorizontal: padding }}>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                  <View style={{ height: 200, marginTop: 30, width: 275 }}>
                    <Image source={illustration} />
                  </View>

                  <View style={{ height: 80, marginTop: 16, width: '50%' }}>
                    <Image style={{ width: '100%', height: '100%' }} source={logoWhite} />
                  </View>

                  <View style={{ height: 58, marginTop: 16 }}>
                    <Text style={[texts.big]}>
                      {t('Somos um delivery aberto, transparente e consciente.')}
                    </Text>
                  </View>

                  <View style={{ width: '85%', height: 58, marginVertical: 16 }}>
                    <Text style={[texts.default, { color: colors.darkGrey }]}>
                      {t('A plataforma de entregas mais justa, transparente e aberta disponível.')}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <DefaultInput
                value={email}
                title={t('Acesse sua conta')}
                placeholder={t('Digite seu e-mail')}
                onChangeText={setEmail}
                keyboardType="email-address"
                blurOnSubmit
                autoCapitalize="none"
              >
                <DefaultButton
                  disabled={!validateEmail(email) || sendingLink}
                  title={t('Entrar')}
                  onPress={signInHandler}
                />
              </DefaultInput>

              <CheckField
                marginTop={12}
                checked={acceptedTerms}
                onPress={() => setAcceptTerms(!acceptedTerms)}
                text={t('Aceito os termos de uso e a política de privacidade')}
              />

              {/* dummy view to accomadate keyboard better */}
              <View style={{ height: 20 }} />
            </View>

            <View style={{ flex: 1 }} />

            {/* sign up */}
            {/* <View style={styles.bottomContainer}>
              <View style={styles.innerContainer}>
                <View style={{ width: 150 }}>
                  <Text style={[texts.default]} numberOfLines={2}>
                    {t('Faça parte desse movimento')}
                    <Image source={arrow} width={11} height={4} />
                  </Text>
                </View>
                <DefaultButton
                  title={t('Cadastre-se agora')}
                  onPress={() => navigation.navigate('ConsumerRegistration')}
                />
              </View>
            </View> */}
          </View>
        </AvoidingView>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   bottomContainer: {
//     width: '100%',
//     height: 80,
//     flexDirection: 'row',
//     backgroundColor: colors.lightGrey,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 22,
//   },
//   innerContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 48,
//   },
// });
