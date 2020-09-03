import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { t } from '../../../strings';
import CheckField from '../../components/CheckField';
import DefaultButton from '../../components/buttons/DefaultButton';
import { colors, texts, screens } from '../../styles';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileErase'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileErase'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

interface ScreenState {
  notWorkingOnMyRegion: boolean;
  didntFindWhatINeeded: boolean;
  pricesHigherThanAlternatives: boolean;
  didntLikeApp: boolean;
  didntFeelSafe: boolean;
  ratherUseAnotherApp: boolean;
}

export default function ({ navigation }: Props) {
  // state
  const [state, setState] = useState<ScreenState>({
    notWorkingOnMyRegion: false,
    didntFindWhatINeeded: false,
    pricesHigherThanAlternatives: false,
    didntLikeApp: false,
    didntFeelSafe: false,
    ratherUseAnotherApp: false,
  });
  // UI
  return (
    <View style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.big, marginTop: 16 }}>
        {t('Tem certeza que deseja excluir sua conta?')}
      </Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Todos os seus dados serão apagados do nosso sistema, juntamente com seu histórico de pedidos, e você terá que criar um novo cadastro para usar o AppJusto.'
        )}
      </Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t('Se você estiver certo disso, pode contar pra gente por que está excluindo sua conta?')}
      </Text>
      <View style={{ marginTop: 24, flex: 1 }}>
        <CheckField
          checked={state.notWorkingOnMyRegion}
          text={t('Não atende na minha região')}
          onPress={() => setState({ ...state, notWorkingOnMyRegion: !state.notWorkingOnMyRegion })}
        />
        <CheckField
          checked={state.didntFindWhatINeeded}
          text={t('Não encontrei o que preciso')}
          onPress={() => setState({ ...state, didntFindWhatINeeded: !state.didntFindWhatINeeded })}
        />
        <CheckField
          checked={state.pricesHigherThanAlternatives}
          text={t('Preços mais altos que os concorrentes')}
          onPress={() =>
            setState({
              ...state,
              pricesHigherThanAlternatives: !state.pricesHigherThanAlternatives,
            })
          }
        />
        <CheckField
          checked={state.didntLikeApp}
          text={t('Não gostei do aplicativo')}
          onPress={() => setState({ ...state, didntLikeApp: !state.didntLikeApp })}
        />
        <CheckField
          checked={state.didntFeelSafe}
          text={t('Não me senti seguro')}
          onPress={() => setState({ ...state, didntFeelSafe: !state.didntFeelSafe })}
        />
        <CheckField
          checked={state.ratherUseAnotherApp}
          text={t('Prefiro usar outro serviço ou aplicativo')}
          onPress={() => setState({ ...state, ratherUseAnotherApp: !state.ratherUseAnotherApp })}
        />
      </View>
      <View style={{ flex: 1 }} />
      <View>
        <DefaultButton
          style={{ width: '100%', marginBottom: 8 }}
          title={t('Manter minha conta')}
          onPress={() => navigation.goBack()}
        />
        <DefaultButton
          disabled
          title={t('Tenho certeza, pode excluir')}
          style={{ marginBottom: 16 }}
          onPress={() => {
            navigation.navigate('EraseConfirmed');
          }}
        />
      </View>
    </View>
  );
}
