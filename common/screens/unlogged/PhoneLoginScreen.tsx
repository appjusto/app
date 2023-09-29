import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { ConfirmationResult } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Linking, Modal, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { CodeInput } from '../../../courier/approved/ongoing/code-input/CodeInput';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import { ApiContext, AppDispatch } from '../../app/context';
import DefaultButton from '../../components/buttons/DefaultButton';
import PaddedView from '../../components/containers/PaddedView';
import { phoneFormatter } from '../../components/inputs/pattern-input/formatters';
import { track, useSegmentScreen } from '../../store/api/track';
import { showToast } from '../../store/ui/actions';
import {
  biggerPadding,
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../styles';
import { getFirebaseAuthErrorMessages } from '../profile/getFirebaseAuthErrorMessages';
import { UnloggedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnloggedParamList, 'PhoneLoginScreen'>;
type ScreenRouteProp = RouteProp<UnloggedParamList, 'PhoneLoginScreen'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

type State =
  | 'initial'
  | 'verifying-phone-number'
  | 'phone-number-verified'
  | 'verifying-code'
  | 'error'
  | 'unrecoverable-error'
  | 'success'
  | 'access-code';

export const PhoneLoginScreen = ({ navigation, route }: Props) => {
  // params
  const { phone, countryCode } = route.params;
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // state
  const [state, setState] = React.useState<State>('initial');
  const [confirmationResult, setConfirmationResult] = React.useState<ConfirmationResult>();
  const [verificationCode, setVerificationCode] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState<string>();
  const [modalVisible, setModalVisible] = useState(false);
  // refs
  const recaptchaRef = React.useRef(null);
  // effects
  // tracking
  useSegmentScreen('Phone Login');
  React.useEffect(() => {
    console.log('state', state);
    track('Phone Login state change', {
      state,
    });
    if (state === 'success') {
      Keyboard.dismiss();
      dispatch(showToast('Validação finalizada com sucesso!', 'success'));
    }
  }, [state]);

  // handlers
  React.useEffect(() => {
    setState('verifying-phone-number');
    api
      .auth()
      .signInWithPhoneNumber(recaptchaRef.current!, phone, countryCode)
      .then((result) => {
        setConfirmationResult(result);
        setState('phone-number-verified');
      })
      .catch((error) => {
        console.error(error);
        Sentry.Native.captureException(error);
        setError(t('Não foi possível verificar o telefone. Edite seu perfil e tente novamente.'));
        setState('unrecoverable-error');
      });
  }, []);
  const verifyCodeHandler = () => {
    (async () => {
      try {
        setState('verifying-code');
        await api.auth().confirmPhoneSignIn(confirmationResult!.verificationId, verificationCode);
      } catch (err: any) {
        let message: string = err.message;
        if (message.indexOf('linked to one identity') > 0) {
          message = t(
            'Esse número já está associado à uma outra conta. Edite seu perfil e tente novamente.'
          );
          setState('unrecoverable-error');
        } else {
          message = getFirebaseAuthErrorMessages(err);
          setState('error');
        }
        setError(message);
      }
    })();
  };
  const loginWithAccessCode = () => {
    (async () => {
      try {
        setLoading(true);
        const token = await api.auth().loginWithAccessCode(phone, verificationCode);
        await api.auth().signInWithCustomToken(token);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        if ('message' in err) {
          dispatch(showToast(err.message, 'error'));
        }
      }
    })();
  };
  // UI
  return (
    <PaddedView
      style={{
        ...screens.centered,
        backgroundColor: colors.grey50,
      }}
    >
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          <View
            style={{
              marginHorizontal: doublePadding,
              backgroundColor: colors.white,
              padding: doublePadding,
              borderRadius: halfPadding,
            }}
          >
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t(
                'Se você estiver com dificuldades em receber o código via SMS, entre em contato com nosso suporte para solicitar um código de acesso.'
              )}
            </Text>
            <DefaultButton
              style={{ marginTop: padding }}
              title="Solicitar código de acesso"
              onPress={() =>
                Linking.openURL(
                  `${AppJustoAssistanceWhatsAppURL}?text=${encodeURIComponent(
                    'Não estou recebendo SMS e gostaria de solicitar um código de acesso.'
                  )}`
                )
              }
            />
            <DefaultButton
              style={{ marginTop: padding }}
              title="Estou com o código de acesso"
              onPress={() => {
                setModalVisible(false);
                setState('access-code');
              }}
              variant="secondary"
            />
            <DefaultButton
              style={{ marginTop: padding }}
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              variant="secondary"
            />
          </View>
        </View>
      </Modal>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaRef}
        firebaseConfig={api.getFirebaseOptions()}
        attemptInvisibleVerification={false}
        title={t('Verificação')}
        cancelLabel={t('Cancelar')}
        languageCode="pt"
      />
      {state === 'verifying-phone-number' || state === 'verifying-code' ? (
        <ActivityIndicator size="large" color={colors.green500} />
      ) : null}
      {state === 'phone-number-verified' || state === 'error' ? (
        <View>
          <Text style={{ ...texts.x2l }}>{t('Confirme seu celular')}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginTop: padding }}>
            {t(
              `Enviamos um código SMS para o número +${countryCode} ${phoneFormatter(
                phone
              )}. Você deverá recebê-lo nos próximos segundos. Ao receber, informe o código abaixo:`
            )}
          </Text>
          <CodeInput
            style={{ marginTop: biggerPadding }}
            value={verificationCode}
            onChange={setVerificationCode}
            length={6}
          />
          <Text style={{ ...texts.sm, color: colors.red, marginTop: padding }}>
            {t(
              'Se você não receber o código em alguns segundos, verifique seu número e a caixa de SPAM do seu aplicativo de mensagens.'
            )}
          </Text>
          {state === 'error' ? (
            <Text style={{ ...texts.sm, color: colors.red, marginTop: padding }}>{error}</Text>
          ) : null}
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginTop: doublePadding }}
            title={state !== 'error' ? t('Validar') : t('Tentar novamente')}
            onPress={verifyCodeHandler}
          />
          <DefaultButton
            style={{ marginTop: padding, marginBottom: doublePadding }}
            title={t('Não recebi o código')}
            activityIndicator={loading}
            onPress={() => setModalVisible(true)}
            variant="secondary"
          />
        </View>
      ) : null}
      {state === 'access-code' ? (
        <View>
          <Text style={{ ...texts.x2l }}>{t('Digite o código de acesso')}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginTop: padding }}>
            {t(`Digite o código de acesso que você recebeu do nosso suporte:`)}
          </Text>
          <CodeInput
            style={{ marginTop: biggerPadding }}
            value={verificationCode}
            onChange={setVerificationCode}
            length={6}
          />
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginVertical: doublePadding }}
            title={t('Validar')}
            onPress={loginWithAccessCode}
          />
        </View>
      ) : null}
      {state === 'unrecoverable-error' ? (
        <View>
          <Text style={{ ...texts.x2l }}>{t('Verificação falhou')}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginTop: padding }}>{error}</Text>
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginVertical: doublePadding }}
            title={t('Voltar')}
            onPress={() => navigation.goBack()}
          />
        </View>
      ) : null}
    </PaddedView>
  );
};
