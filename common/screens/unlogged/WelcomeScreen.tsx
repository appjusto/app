import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useState } from 'react';
import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../app/context';
import CheckField from '../../components/buttons/CheckField';
import DefaultButton from '../../components/buttons/DefaultButton';
import AvoidingView from '../../components/containers/AvoidingView';
import DefaultInput from '../../components/inputs/DefaultInput';
import { IconIllustrationIntro } from '../../icons/icon-illustrationIntro';
import { IconIntroDelivery } from '../../icons/icon-IntroDelivery';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { getExtra, getFlavor } from '../../store/config/selectors';
import { showToast } from '../../store/ui/actions';
import { getUIBusy } from '../../store/ui/selectors';
import { signInWithEmail } from '../../store/user/actions';
import { colors, padding, screens, texts } from '../../styles';
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

  // app state
  const busy = useSelector(getUIBusy);
  const flavor = useSelector(getFlavor);
  const extra = useSelector(getExtra);

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
    await dispatch(signInWithEmail(api)(email, extra.environment));
    navigation.navigate('SignInFeedback', { email });
  }, [acceptedTerms, email]);

  const welcomeMessage =
    flavor === 'consumer'
      ? t('Somos um delivery aberto, transparente e consciente.')
      : t('Ganhe mais e tenha mais controle do seu tempo.');

  // UI
  return (
    <SafeAreaView style={{ ...screens.default, padding }}>
      <AvoidingView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ left: -16 }}>
            {flavor === 'consumer' ? <IconIllustrationIntro /> : <IconIntroDelivery />}
          </View>
          <View style={{ marginTop: padding }}>
            <IconLogoGreen />
          </View>
          <View style={{ marginTop: padding }}>
            <Text style={[texts.x2l]}>{welcomeMessage}</Text>
          </View>
          <View style={{ marginTop: padding }}>
            <Text style={[texts.sm, { color: colors.grey700, lineHeight: 21 }]}>
              {t('Digite seu e-mail para entrar ou criar sua conta.')}
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={{ marginTop: padding }}>
          <DefaultInput
            value={email}
            title={t('Acesse sua conta')}
            placeholder={t('Digite seu e-mail')}
            onChangeText={setEmail}
            keyboardType="email-address"
            blurOnSubmit
            autoCapitalize="none"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Terms');
              }}
            >
              <Text style={[texts.xs, { color: colors.green600 }]}>{t('Ler os termos')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ marginVertical: padding }}>
          <DefaultButton
            disabled={validateEmail(email).status !== 'ok' || !acceptedTerms || busy}
            title={t('Entrar')}
            onPress={signInHandler}
            activityIndicator={busy}
          />
        </View>
      </AvoidingView>
    </SafeAreaView>
  );
}
