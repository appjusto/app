import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { t } from '../../../strings';
import DefaultButton from '../../components/buttons/DefaultButton';
import FeedbackView from '../../components/views/FeedbackView';
import useAuth, { AuthState } from '../../hooks/useAuth';
import { IconMotocycle } from '../../icons/icon-motocycle';
import { colors } from '../../styles';
import { UnloggedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnloggedParamList, 'SignInFeedback'>;
type ScreenRouteProp = RouteProp<UnloggedParamList, 'SignInFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation }: Props) => {
  // state
  const [authState] = useAuth();

  // UI
  if (authState === AuthState.SignedIn) {
    return null;
  }

  return (
    <FeedbackView
      header={t('Enviamos um link de confirmação para o seu e-mail.')}
      description={t('Continue o acesso clicando no link que você recebeu.')}
      icon={<IconMotocycle />}
      background={colors.white}
    >
      <DefaultButton
        title={t('Voltar para alterar o e-mail')}
        onPress={() => navigation.goBack()}
        secondary
      />
    </FeedbackView>
  );
};
