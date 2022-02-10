import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
import ShowIf from '../../components/views/ShowIf';
import { IconAppRoundWhiteBG } from '../../icons/icon-app-round-white-bg';
import { IconIllustrationIntro } from '../../icons/icon-illustrationIntro';
import { IconIntroBusiness } from '../../icons/icon-intro-business';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { IconMotoCycleBig } from '../../icons/icon-motocycle-big';
import { useSegmentScreen } from '../../store/api/track';
import { showToast } from '../../store/ui/actions';
import { getUIBusy } from '../../store/ui/selectors';
import { signInWithEmail, signInWithEmailAndPassword } from '../../store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../styles';
import { validateEmail } from '../../utils/validators';
import HomeCard from '../home/cards/HomeCard';
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
  // const flavor = useSelector(getFlavor);
  const flavor = 'business';
  // state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPasswordShown, setPasswordShown] = React.useState(false);
  const [acceptedTerms, setAcceptTerms] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('Welcome');
  // handlers
  const signInHandler = async () => {
    Keyboard.dismiss();
    if (!acceptedTerms) {
      dispatch(showToast(t('Você precisa aceitar os termos para criar sua conta.'), 'error'));
      return;
    }
    if (validateEmail(email).status !== 'ok') {
      dispatch(showToast(t('Digite um e-mail válido.'), 'error'));
      return;
    }
    try {
      if (!isPasswordShown) {
        await dispatch(signInWithEmail(api)(email.trim()));
        navigation.navigate('SignInFeedback', { email });
      } else {
        await dispatch(signInWithEmailAndPassword(api)(email.trim(), password.trim()));
      }
      navigation.navigate('SignInFeedback', { email });
    } catch (error) {
      console.error(error);
      Sentry.Native.captureException(error);
      dispatch(
        showToast(t('Não foi possível registrar. Verifique seu e-mail e tente novamente.'), 'error')
      );
    }
  };
  let welcomeMessage;
  if (flavor === 'courier') welcomeMessage = t('Ganhe mais, com autonomia e transparência.');
  if (flavor === 'business')
    welcomeMessage = t('Gerencie seu restaurante de forma fácil e automatizada.');
  else welcomeMessage = t('Um delivery aberto, transparente e consciente.');
  let emailMessage;
  if (flavor === 'business')
    emailMessage = t('Ao entrar sem senha, enviaremos um link de acesso para o e-mail cadastrado');
  else emailMessage = t('Digite seu e-mail para entrar ou criar sua conta.');
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
            onLongPress={() => setPasswordShown(!isPasswordShown)}
          >
            <>
              {illustrationUI()}
              <View style={{ marginTop: flavor !== 'consumer' ? padding : 0 }}>
                <IconLogoGreen />
              </View>
              <View style={{ marginTop: padding }}>
                <Text style={[texts.x2l]}>{welcomeMessage}</Text>
                <Text style={[texts.sm, { color: colors.grey700, marginTop: padding }]}>
                  {emailMessage}
                </Text>
              </View>
            </>
          </Pressable>

          <View style={{ flex: 1 }}>
            <View style={{ marginTop: padding }}>
              <DefaultInput
                value={email}
                title={flavor === 'business' ? t('Entrar') : t('Acesse sua conta')}
                placeholder={t('Digite seu e-mail')}
                onChangeText={setEmail}
                autoCompleteType="email"
                keyboardType="email-address"
                blurOnSubmit
                autoCapitalize="none"
              />
              <ShowIf test={email.length > 5 && validateEmail(email).status !== 'ok'}>
                {() => (
                  <Text style={{ ...texts.sm, color: colors.red, marginTop: halfPadding }}>
                    {t('O e-mail digitado não é válido')}
                  </Text>
                )}
              </ShowIf>
              {isPasswordShown ? (
                <DefaultInput
                  style={{ marginTop: padding }}
                  value={password}
                  title={t('Senha')}
                  placeholder={t('Senha de acesso')}
                  onChangeText={setPassword}
                  keyboardType="visible-password"
                  blurOnSubmit
                  autoCapitalize="none"
                />
              ) : null}
            </View>
            {flavor === 'business' && isPasswordShown ? (
              <Text style={[texts.sm, { color: colors.grey700, marginTop: padding }]}>
                {t(
                  'Esqueceu a senha? Então desative essa opção e faça o login somente com o e-mail cadastrado'
                )}
              </Text>
            ) : null}
            {flavor === 'business' ? (
              <View
                style={{
                  flexDirection: tallerDevice ? 'row' : 'column',
                  alignItems: tallerDevice ? 'center' : 'flex-start',
                  justifyContent: 'space-between',
                  marginTop: padding,
                }}
              >
                <View>
                  <CheckField
                    checked={isPasswordShown}
                    onPress={() => setPasswordShown(!isPasswordShown)}
                    text={t('Usar senha de acesso')}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: tallerDevice ? 'row' : 'column',
                  alignItems: tallerDevice ? 'center' : 'flex-start',
                  justifyContent: 'space-between',
                  marginTop: padding,
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
            )}
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ marginTop: 32, paddingBottom: padding }}>
            <DefaultButton
              disabled={validateEmail(email).status !== 'ok' || !acceptedTerms || busy}
              title={
                flavor === 'consumer'
                  ? t('Faça login para pedir')
                  : flavor === 'business'
                  ? t('Entrar no restaurante')
                  : t('Entrar')
              }
              onPress={signInHandler}
              activityIndicator={busy}
            />
          </View>
          {flavor === 'business' ? (
            <TouchableOpacity style={{ marginBottom: padding }}>
              <HomeCard
                icon={<IconAppRoundWhiteBG />}
                title={t('Não tem conta no AppJusto?')}
                subtitle={t('Clique aqui e faça o cadastro do seu restaurante agora mesmo!')}
                grey
                borderColor={colors.grey50}
              />
            </TouchableOpacity>
          ) : null}
          {flavor === 'courier' ? <LocationDisclosureModal /> : null}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
