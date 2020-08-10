import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { motocycle } from '../../assets/icons';
import useAuth, { AuthState } from '../../hooks/useAuth';
import { showToast } from '../../store/ui/actions';
import { signInWithEmail } from '../../store/user/actions';
import { t } from '../../strings';
import { ApiContext } from '../app/context';
import DefaultButton from '../common/DefaultButton';
import FeedbackView from '../common/FeedbackView';
import { colors, borders } from '../common/styles';
import { UnloggedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnloggedParamList, 'SignInFeedback'>;
type ScreenRouteProp = RouteProp<UnloggedParamList, 'SignInFeedback'>;

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
    <FeedbackView
      header={t('Enviamos um link de confirmação para você.')}
      description={t('Continue o acesso usando seu e-mail')}
      icon={motocycle}
    >
      <DefaultButton
        title={t('Enviar confirmação novamente')}
        onPress={resendLink}
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: 'white' }}
      />
    </FeedbackView>
  );
};
