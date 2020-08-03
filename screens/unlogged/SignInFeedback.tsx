import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { useDispatch } from 'react-redux';

import { motocycle } from '../../assets/icons';
import useAuth, { AuthState } from '../../hooks/useAuth';
import { showToast } from '../../store/ui/actions';
import { signInWithEmail } from '../../store/user/actions';
import { t } from '../../strings';
import { ApiContext } from '../app/context';
import DefaultButton from '../common/DefaultButton';
import { colors, texts, borders, screens } from '../common/styles';
import { UnloggedStackParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnloggedStackParamList, 'SignInFeedback'>;
type ScreenRouteProp = RouteProp<UnloggedStackParamList, 'SignInFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ route }: Props) => {
  // context
  const api = useContext(ApiContext);
  const { params } = route;
  const dispatch = useDispatch();

  // state
  const [authState] = useAuth();

  // handlers
  const resendLink = (): void => {
    dispatch(showToast(t('Enviando link de autenticação para o seu e-mail...')));
    signInWithEmail(api)(params.email).then((result) => console.log(result));
  };

  // UI
  if (authState === AuthState.SignedIn) {
    return null;
  }

  return (
    <View style={[screens.padded, { backgroundColor: colors.lightGrey }]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...texts.big, textAlign: 'center' }}>
            {t('Enviamos um link de confirmação para você.')}
          </Text>
          <View style={{ height: 114, width: 114, marginTop: 22, marginBottom: 16 }}>
            <Image source={motocycle} />
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>
            {t('Continue o acesso usando seu e-mail')}
          </Text>
        </View>
      </View>
      <DefaultButton
        title={t('Enviar confirmação novamente')}
        onPress={resendLink}
        styleObject={{ ...borders.default, borderColor: colors.black, backgroundColor: 'white' }}
      />
    </View>
  );
};
