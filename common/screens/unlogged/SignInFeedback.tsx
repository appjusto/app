import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { t } from '../../../strings';
import PaddedView from '../../components/containers/PaddedView';
import { AuthState, useAuth } from '../../hooks/useAuth';
import { IconMotocycle } from '../../icons/icon-motocycle';
import { useSegmentScreen } from '../../store/api/track';
import { colors, padding, screens, texts } from '../../styles';
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
  // side effects
  // tracking
  useSegmentScreen('Sign in Feedback');
  // UI
  if (authState === AuthState.SignedIn) {
    return null;
  }
  return (
    <PaddedView style={screens.default}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...texts.x2l, textAlign: 'center' }}>
            {t('Enviamos uma confirmação para o seu e-mail.')}
          </Text>
          <View style={{ height: 114, width: 114, marginTop: 22, marginBottom: 16 }}>
            <IconMotocycle />
          </View>
          <Text style={{ ...texts.sm, color: colors.grey700, textAlign: 'center' }}>
            {t('Continue o acesso clicando no link enviado.')}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center' }}>
            <>
              <Text style={{ marginTop: padding, ...texts.xs, color: colors.green600 }}>
                {t('Não recebeu? Preencha seu e-mail novamente.')}
              </Text>
            </>
          </TouchableOpacity>
        </View>
      </View>
    </PaddedView>
  );
};
