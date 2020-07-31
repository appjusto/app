import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { t } from '../../../strings';
import CheckField from '../../common/CheckField';
import DefaultButton from '../../common/DefaultButton';
import { colors, texts, screens } from '../../common/styles';

interface ScreenState {
  notWorkingOnMyRegion: boolean;
  didntFindWhatINeeded: boolean;
  pricesHigherThanAlternatives: boolean;
  didntLikeApp: boolean;
  didntFeelSafe: boolean;
  ratherUseAnotherApp: boolean;
}

const EraseConfirmed = () => {
  // context
  const navigation = useNavigation();

  // state
  const [state, setState] = useState<ScreenState>({
    notWorkingOnMyRegion: false,
    didntFindWhatINeeded: false,
    pricesHigherThanAlternatives: false,
    didntLikeApp: false,
    didntFeelSafe: false,
    ratherUseAnotherApp: false,
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  // UI
  return (
    <View style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.big, marginTop: 16, width: '80%' }}>
        {t('Sua conta foi excluída com sucesso.')}
      </Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Obrigado por fazer parte do AppJusto. Antes de ir embora, conta pra gente o que motivou você a excluir sua conta?'
        )}
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
        <View style={{ flex: 1 }} />
        <DefaultButton
          styleObject={{ width: '100%', marginBottom: 16 }}
          title={t('Voltar para a tela inicial')}
          onPress={() => navigation.navigate('ConsumerHome')}
        />
      </View>
    </View>
  );
};

export default EraseConfirmed;
