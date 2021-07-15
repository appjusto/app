import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { LocationDisclosureModal } from '../../../courier/approved/main/home/LocationDisclosureModal';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../app/context';
import CheckField from '../../components/buttons/CheckField';
import DefaultButton from '../../components/buttons/DefaultButton';
import DefaultInput from '../../components/inputs/DefaultInput';
import ShowIf from '../../components/views/ShowIf';
import { IconBetaSmall } from '../../icons/icon-beta-small';
import { IconIllustrationIntro } from '../../icons/icon-illustrationIntro';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { IconMotoCycleBig } from '../../icons/icon-motocycle-big';
import { track, useSegmentScreen } from '../../store/api/track';
import { getExtra, getFlavor } from '../../store/config/selectors';
import { showToast } from '../../store/ui/actions';
import { getUIBusy } from '../../store/ui/selectors';
import { signInWithEmail } from '../../store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../styles';
import { validateEmail } from '../../utils/validators';
import { UnloggedParamList } from './types';

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
  // const tallerDevice = useTallerDevice();
  const { height } = Dimensions.get('window');
  const tallerDevice = height > 640;
  // redux store
  const busy = useSelector(getUIBusy);
  const flavor = useSelector(getFlavor);
  const extra = useSelector(getExtra);
  // state
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptTerms] = useState(false);
  // side effects
  useSegmentScreen('Welcome');
  // handlers
  const signInHandler = useCallback(async () => {
    Keyboard.dismiss();
    if (!acceptedTerms) {
      dispatch(showToast(t('Você precisa aceitar os termos para criar sua conta.'), 'error'));
      return;
    }
    if (validateEmail(email).status !== 'ok') {
      dispatch(showToast(t('Digite um e-mail válido.'), 'error'));
      return;
    }
    track('Signing in', { email });
    try {
      await dispatch(signInWithEmail(api)(email.trim(), extra.environment));
    } catch (error) {
      dispatch(
        showToast(t('Não foi possível registrar. Verifique seu e-mail e tente novamente.'), 'error')
      );
    }
    navigation.navigate('SignInFeedback', { email });
  }, [acceptedTerms, api, dispatch, email, extra.environment, navigation]);

  const welcomeMessage =
    flavor === 'consumer'
      ? t('Um delivery aberto, transparente e consciente.')
      : t('Ganhe mais, com autonomia e transparência.');
  // UI
  return (
    <View style={{ ...screens.default }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        extraHeight={Platform.select({ android: 32 })}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <>
              <ShowIf test={tallerDevice && flavor === 'consumer'}>
                {() => (
                  <View
                    style={{ left: -16, flexDirection: 'row', justifyContent: 'space-between' }}
                  >
                    <View style={{ top: -16 }}>
                      <IconIllustrationIntro />
                    </View>
                    <IconBetaSmall />
                  </View>
                )}
              </ShowIf>
              <ShowIf test={tallerDevice && flavor === 'courier'}>
                {() => (
                  <View
                    style={{ left: -16, flexDirection: 'row', justifyContent: 'space-between' }}
                  >
                    <IconMotoCycleBig />
                    <IconBetaSmall />
                  </View>
                )}
              </ShowIf>
              <View style={{ marginTop: flavor === 'courier' ? padding : 0 }}>
                <IconLogoGreen />
              </View>
              <View style={{ marginTop: padding }}>
                <Text style={[texts.x2l]}>{welcomeMessage}</Text>
                <Text
                  style={[texts.sm, { color: colors.grey700, lineHeight: 21, marginTop: padding }]}
                >
                  {t('Digite seu e-mail para entrar ou criar sua conta.')}
                </Text>
              </View>
            </>
          </TouchableWithoutFeedback>

          <View style={{ flex: 1 }}>
            <View style={{ marginTop: padding }}>
              <DefaultInput
                value={email}
                title={t('Acesse sua conta')}
                placeholder={t('Digite seu e-mail')}
                onChangeText={setEmail}
                autoCompleteType="email"
                keyboardType="email-address"
                blurOnSubmit
                autoCapitalize="none"
              />
            </View>
            <View
              style={{
                flexDirection: tallerDevice ? 'row' : 'column',
                alignItems: tallerDevice ? 'center' : 'flex-start',
                justifyContent: 'space-between',
                marginTop: padding,
                // flex: 1,
              }}
            >
              <View>
                <CheckField
                  checked={acceptedTerms}
                  onPress={() => setAcceptTerms(!acceptedTerms)}
                  text={t('Aceito os termos de uso do app')}
                />
              </View>
              <View style={{ marginTop: !tallerDevice ? halfPadding : 0 }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Terms');
                  }}
                >
                  <Text style={[texts.xs, { color: colors.green600 }]}>{t('Ler os termos')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ marginTop: 32, paddingBottom: padding }}>
            <DefaultButton
              disabled={validateEmail(email).status !== 'ok' || !acceptedTerms || busy}
              title={flavor === 'courier' ? t('Entrar') : t('Faça login para pedir')}
              onPress={signInHandler}
              activityIndicator={busy}
              style={{ marginBottom: padding }}
            />
          </View>

          {flavor === 'courier' && <LocationDisclosureModal />}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
