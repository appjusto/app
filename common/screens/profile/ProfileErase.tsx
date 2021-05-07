import { DeleteAccountPayload } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileParamList } from '../../../consumer/v2/main/profile/types';
import { CourierProfileParamList } from '../../../courier/approved/main/profile/types';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../app/context';
import CheckField from '../../components/buttons/CheckField';
import DefaultButton from '../../components/buttons/DefaultButton';
import { useSegmentScreen } from '../../store/api/track';
import { showToast } from '../../store/ui/actions';
import { getUIBusy } from '../../store/ui/selectors';
import { deleteAccount } from '../../store/user/actions';
import { colors, padding, screens, texts } from '../../styles';

export type ProfileEraseParamList = {
  ProfileErase: undefined;
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & CourierProfileParamList & UnapprovedParamList,
  'ProfileErase'
>;
type ScreenRouteProp = RouteProp<ProfileEraseParamList, 'ProfileErase'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const busy = useSelector(getUIBusy);
  // screen state
  const [survey, setSurvey] = useState({
    notWorkingOnMyRegion: false,
    didntFindWhatINeeded: false,
    pricesHigherThanAlternatives: false,
    didntLikeApp: false,
    didntFeelSafe: false,
    ratherUseAnotherApp: false,
  } as Partial<DeleteAccountPayload>);
  // side effects
  // tracking
  useSegmentScreen('Profile Erase');
  // handlers
  const eraseHandler = async () => {
    try {
      await dispatch(deleteAccount(api)(survey));
    } catch (error) {
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  // UI
  return (
    <View style={{ ...screens.lightGrey }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Text style={{ ...texts.x2l, marginTop: 16 }}>
            {t('Tem certeza que deseja excluir sua conta?')}
          </Text>
          <Text style={{ ...texts.sm, marginTop: 16, color: colors.grey700 }}>
            {t(
              'Todos os seus dados serão apagados do nosso sistema, juntamente com seu histórico de pedidos, e você terá que criar um novo cadastro para usar o AppJusto.'
            )}
          </Text>
          <Text style={{ ...texts.sm, marginTop: 16, color: colors.grey700 }}>
            {t(
              'Se você estiver certo disso, pode contar pra gente por que está excluindo sua conta?'
            )}
          </Text>
        </View>
        <View style={{ marginTop: 24, flex: 1 }}>
          <CheckField
            checked={survey.notWorkingOnMyRegion}
            text={t('Não atende na minha região')}
            style={{ marginBottom: 12 }}
            onPress={() =>
              setSurvey({ ...survey, notWorkingOnMyRegion: !survey.notWorkingOnMyRegion })
            }
          />
          <CheckField
            checked={survey.didntFindWhatINeeded}
            text={t('Não encontrei o que preciso')}
            style={{ marginBottom: 12 }}
            onPress={() =>
              setSurvey({ ...survey, didntFindWhatINeeded: !survey.didntFindWhatINeeded })
            }
          />
          <CheckField
            checked={survey.pricesHigherThanAlternatives}
            text={t('Preços mais altos que os concorrentes')}
            style={{ marginBottom: 12 }}
            onPress={() =>
              setSurvey({
                ...survey,
                pricesHigherThanAlternatives: !survey.pricesHigherThanAlternatives,
              })
            }
          />
          {/* <CheckField
          checked={survey.didntLikeApp}
          text={t('Não gostei do aplicativo')}
          style={{ marginBottom: 12 }}
          onPress={() => setSurvey({ ...survey, didntLikeApp: !survey.didntLikeApp })}
        />
        <CheckField
          checked={survey.didntFeelSafe}
          text={t('Não me senti seguro')}
          style={{ marginBottom: 12 }}
          onPress={() => setSurvey({ ...survey, didntFeelSafe: !survey.didntFeelSafe })}
        /> */}
          <CheckField
            checked={survey.ratherUseAnotherApp}
            text={t('Prefiro usar outro serviço ou aplicativo')}
            onPress={() =>
              setSurvey({ ...survey, ratherUseAnotherApp: !survey.ratherUseAnotherApp })
            }
          />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ marginTop: padding }}>
          <SafeAreaView>
            <DefaultButton
              style={{ width: '100%', marginBottom: 8 }}
              title={t('Manter minha conta')}
              disabled={busy}
              onPress={() => navigation.goBack()}
            />
            <DefaultButton
              title={t('Tenho certeza, pode excluir')}
              style={{ marginBottom: 16 }}
              onPress={eraseHandler}
              disabled={busy}
              activityIndicator={busy}
              secondary
            />
          </SafeAreaView>
        </View>
      </ScrollView>
    </View>
  );
}
