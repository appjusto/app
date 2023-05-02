import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { LocationDisclosureModal } from '../../../courier/approved/main/home/LocationDisclosureModal';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../app/context';
import CheckField from '../../components/buttons/CheckField';
import DefaultButton from '../../components/buttons/DefaultButton';
import DefaultInput from '../../components/inputs/DefaultInput';
import PatternInput from '../../components/inputs/PatternInput';
import { phoneFormatter, phoneMask } from '../../components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../components/inputs/pattern-input/parsers';
import { useFacebookAds } from '../../hooks/useFacebookAds';
import { IconIllustrationIntro } from '../../icons/icon-illustrationIntro';
import { IconIntroBusiness } from '../../icons/icon-intro-business';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { IconMotoCycleBig } from '../../icons/icon-motocycle-big';
import { AuthMode } from '../../store/api/auth';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { showToast } from '../../store/ui/actions';
import { getUIBusy } from '../../store/ui/selectors';
import { signInWithEmailAndPassword } from '../../store/user/actions';
import { colors, doublePadding, halfPadding, padding, screens, texts } from '../../styles';
import { validateEmail } from '../../utils/validators';
import { UnloggedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnloggedParamList, 'WelcomeScreen'>;
type ScreenRouteProp = RouteProp<UnloggedParamList, 'WelcomeScreen'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const { height } = Dimensions.get('window');
const tallerDevice = height > 680;

export default function ({ navigation, route }: Props) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const busy = useSelector(getUIBusy);
  const flavor = useSelector(getFlavor);
  // state
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authMode, setAuthMode] = React.useState<AuthMode>(api.auth().defaultAuthMode);
  const [acceptedTerms, setAcceptTerms] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('Welcome');
  useFacebookAds();
  React.useEffect(() => {
    const update = () => setAuthMode(api.auth().defaultAuthMode);
    navigation.addListener('focus', update);
    return () => navigation.removeListener('focus', update);
  }, []);
  // handlers
  const signInHandler = async () => {
    Keyboard.dismiss();
    if (flavor !== 'business' && !acceptedTerms) {
      dispatch(showToast(t('Você precisa aceitar os termos para criar sua conta.'), 'error'));
      return;
    }
    try {
      track('Welcome sign in', {
        authMode,
      });
      if (authMode === 'phone') {
        navigation.navigate('PhoneLoginScreen', { phone, countryCode: '55' });
      } else {
        if (validateEmail(email).status !== 'ok') {
          dispatch(showToast(t('Digite um e-mail válido.'), 'error'));
          return;
        }
        if (authMode === 'password') {
          await dispatch(signInWithEmailAndPassword(api)(email.trim(), password.trim()));
        }
      }
    } catch (error) {
      console.error(error);
      Sentry.Native.captureException(error);
      dispatch(
        showToast(t('Não foi possível registrar. Verifique seu e-mail e tente novamente.'), 'error')
      );
    }
  };
  // helpers
  let welcomeMessage;
  if (flavor === 'courier') welcomeMessage = t('Ganhe mais, com autonomia e transparência.');
  if (flavor === 'business')
    welcomeMessage = t('Gerencie seu restaurante de forma fácil e automatizada.');
  else welcomeMessage = t('Delivery e entregas com modelo sustentável.');
  const actionButtonTitle = t('Entrar');
  const actionButtonDisabled =
    busy ||
    (authMode === 'phone' && phone.length < 11) ||
    (authMode !== 'phone' && validateEmail(email).status !== 'ok') ||
    (flavor !== 'business' && !acceptedTerms);
  // UI
  const illustrationUI = () => {
    if (flavor === 'consumer') {
      return (
        <View style={{ left: -16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ top: -16 }}>
            <IconIllustrationIntro />
          </View>
        </View>
      );
    }
    if (flavor === 'courier') {
      return (
        <View style={{ left: -16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <IconMotoCycleBig />
        </View>
      );
    }
    if (flavor === 'business') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: doublePadding,
          }}
        >
          <IconIntroBusiness />
        </View>
      );
    }
  };
  return (
    <View style={{ ...screens.default }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        extraHeight={Platform.select({ android: 32 })}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <Pressable
            onPressIn={() => Keyboard.dismiss()}
            delayLongPress={2000}
            onLongPress={() =>
              setAuthMode((current) => (current === 'phone' ? 'password' : 'phone'))
            }
          >
            <>
              {illustrationUI()}
              <View style={{ marginTop: flavor === 'courier' ? padding : 0 }}>
                <IconLogoGreen />
              </View>
              <View style={{ marginTop: padding }}>
                <Text style={[texts.x2l]}>{welcomeMessage}</Text>
                <Text
                  style={[texts.sm, { color: colors.grey700, lineHeight: 21, marginTop: padding }]}
                >
                  {authMode === 'phone'
                    ? t('Digite o número do seu celular')
                    : t('Digite seu e-mail cadastrado')}
                </Text>
              </View>
            </>
          </Pressable>

          <View style={{ flex: 1 }}>
            <View style={{ marginTop: padding }}>
              {authMode !== 'phone' ? (
                <>
                  <DefaultInput
                    value={email}
                    title={t('Acesse sua conta')}
                    placeholder={t('Digite seu e-mail')}
                    onChangeText={(value) => setEmail(value.toLowerCase())}
                    autoComplete="email"
                    keyboardType="email-address"
                    blurOnSubmit
                    autoCapitalize="none"
                    errorMessage={
                      email.length > 5 &&
                      email.includes('@') &&
                      email.includes('.') &&
                      validateEmail(email).status !== 'ok'
                        ? t('O e-mail digitado não é válido')
                        : undefined
                    }
                    autoCorrect={false}
                  />
                </>
              ) : (
                <PatternInput
                  style={{ marginTop: padding }}
                  title={t('Celular')}
                  value={phone}
                  placeholder={t('Número com DDD')}
                  mask={phoneMask}
                  parser={numbersOnlyParser}
                  formatter={phoneFormatter}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  blurOnSubmit
                  onChangeText={(text) => setPhone(trim(text))}
                />
              )}
              {authMode === 'password' ? (
                <DefaultInput
                  style={{ marginTop: padding }}
                  value={password}
                  title={t('Senha')}
                  placeholder={
                    flavor === 'business'
                      ? t('Digite sua senha')
                      : t('Senha que enviamos para seu e-mail')
                  }
                  onChangeText={setPassword}
                  keyboardType="visible-password"
                  blurOnSubmit
                  autoCapitalize="none"
                />
              ) : null}
            </View>
            <View
              style={{
                flexDirection: tallerDevice ? 'row' : 'column',
                alignItems: tallerDevice ? 'center' : 'flex-start',
                justifyContent: 'space-between',
                marginTop: padding,
              }}
            >
              {flavor !== 'business' ? (
                <View>
                  <View>
                    <CheckField
                      checked={acceptedTerms}
                      onPress={() => setAcceptTerms(!acceptedTerms)}
                      text={t('Aceito os termos de uso do app')}
                    />
                  </View>
                  <View style={{ marginTop: halfPadding }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Terms');
                      }}
                    >
                      <Text style={[texts.xs, { color: colors.green600 }]}>
                        {t('Ler os termos')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ marginTop: 32 }}>
            <DefaultButton
              disabled={actionButtonDisabled}
              title={actionButtonTitle}
              onPress={signInHandler}
              activityIndicator={busy}
              style={{ marginBottom: padding }}
            />
          </View>
          {flavor === 'courier' ? <LocationDisclosureModal /> : null}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
