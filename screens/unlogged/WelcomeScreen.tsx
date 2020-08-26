import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { logoWhite, illustration } from '../../assets/icons';
import { getEnv } from '../../store/config/selectors';
import { showToast } from '../../store/ui/actions';
import { signInWithEmail } from '../../store/user/actions';
import { t } from '../../strings';
import { validateEmail } from '../../utils/validators';
import { ApiContext, AppDispatch } from '../app/context';
import AvoidingView from '../common/AvoidingView';
import CheckField from '../common/CheckField';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import { colors, texts, padding, screens } from '../common/styles';
import { UnloggedParamList } from './types';
import { getUIBusy } from '../../store/ui/selectors';

type ScreenNavigationProp = StackNavigationProp<UnloggedParamList, 'WelcomeScreen'>;
type ScreenRouteProp = RouteProp<UnloggedParamList, 'WelcomeScreen'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const busy = useSelector(getUIBusy);

  // state
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptTerms] = useState(false);

  // handlers
  const signInHandler = useCallback(async () => {
    Keyboard.dismiss();
    if (!acceptedTerms) {
      dispatch(showToast(t('Você precisa aceitar os termos para criar sua conta.')));
      return;
    }
    if (validateEmail(email).status !== 'ok') {
      dispatch(showToast(t('Digite um e-mail válido.')));
      return;
    }
    await dispatch(signInWithEmail(api)(email));
    navigation.navigate('SignInFeedback', { email });
  }, [acceptedTerms, email]);

  // UI
  return (
    <View style={[screens.default, { marginBottom: 0 }]}>
      <View style={{ flex: 1 }}>
        <AvoidingView>
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

                  <View style={{ width: '85%', height: 58, marginTop: 16 }}>
                    <Text style={[texts.default, { color: colors.darkGrey, lineHeight: 21 }]}>
                      {t('Digite seu e-mail para entrar ou criar sua conta.')}
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
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}
              >
                <View>
                  <CheckField
                    checked={acceptedTerms}
                    onPress={() => setAcceptTerms(!acceptedTerms)}
                    text={t('Aceito os termos de uso do app')}
                  />
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Terms');
                    }}
                  >
                    <Text style={[texts.small, { color: colors.darkGreen, lineHeight: 18 }]}>
                      {t('Ler os termos')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* dummy view to accomadate keyboard better */}
              <View style={{ height: 20 }} />
            </View>

            <View style={{ flex: 1 }} />
            <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
              <DefaultButton
                disabled={validateEmail(email).status !== 'ok' || !acceptedTerms || busy}
                title={t('Entrar')}
                onPress={signInHandler}
                activityIndicator={busy}
              />
            </View>
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
