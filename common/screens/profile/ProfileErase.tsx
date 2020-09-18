import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useCallback, useContext } from 'react';
import { View, Text } from 'react-native';

import { t } from '../../../strings';
import { ApiContext } from '../../app/context';
import CheckField from '../../components/buttons/CheckField';
import DefaultButton from '../../components/buttons/DefaultButton';
import { deleteAccount } from '../../store/user/actions';
import { DeleteAccountSurvey } from '../../store/user/types';
import { colors, texts, screens } from '../../styles';

export type ProfileEraseParamList = {
  ProfileErase: undefined;
};

type ScreenNavigationProp = StackNavigationProp<ProfileEraseParamList, 'ProfileErase'>;
type ScreenRouteProp = RouteProp<ProfileEraseParamList, 'ProfileErase'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);

  // screen state
  const [survey, setSurvey] = useState<DeleteAccountSurvey>({
    notWorkingOnMyRegion: false,
    didntFindWhatINeeded: false,
    pricesHigherThanAlternatives: false,
    didntLikeApp: false,
    didntFeelSafe: false,
    ratherUseAnotherApp: false,
  });
  // handlers
  const eraseHandler = useCallback(() => {
    deleteAccount(api)(survey);
  }, []);

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
          checked={survey.notWorkingOnMyRegion}
          text={t('Não atende na minha região')}
          onPress={() =>
            setSurvey({ ...survey, notWorkingOnMyRegion: !survey.notWorkingOnMyRegion })
          }
        />
        <CheckField
          checked={survey.didntFindWhatINeeded}
          text={t('Não encontrei o que preciso')}
          onPress={() =>
            setSurvey({ ...survey, didntFindWhatINeeded: !survey.didntFindWhatINeeded })
          }
        />
        <CheckField
          checked={survey.pricesHigherThanAlternatives}
          text={t('Preços mais altos que os concorrentes')}
          onPress={() =>
            setSurvey({
              ...survey,
              pricesHigherThanAlternatives: !survey.pricesHigherThanAlternatives,
            })
          }
        />
        <CheckField
          checked={survey.didntLikeApp}
          text={t('Não gostei do aplicativo')}
          onPress={() => setSurvey({ ...survey, didntLikeApp: !survey.didntLikeApp })}
        />
        <CheckField
          checked={survey.didntFeelSafe}
          text={t('Não me senti seguro')}
          onPress={() => setSurvey({ ...survey, didntFeelSafe: !survey.didntFeelSafe })}
        />
        <CheckField
          checked={survey.ratherUseAnotherApp}
          text={t('Prefiro usar outro serviço ou aplicativo')}
          onPress={() => setSurvey({ ...survey, ratherUseAnotherApp: !survey.ratherUseAnotherApp })}
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
          onPress={eraseHandler}
        />
      </View>
    </View>
  );
}
