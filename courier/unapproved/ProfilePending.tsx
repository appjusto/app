import { ProfileSituation } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firebase from 'firebase';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import useLastKnownLocation from '../../common/location/useLastKnownLocation';
import useCourierDocumentImage from '../../common/store/api/courier/hooks/useCourierDocumentImage';
import useCourierSelfie from '../../common/store/api/courier/hooks/useCourierSelfie';
import { track, useSegmentScreen } from '../../common/store/api/track';
import { getCourier } from '../../common/store/courier/selectors';
import {
  bankAccountSet,
  companyInfoSet,
  courierInfoSet,
} from '../../common/store/courier/validators';
import { showToast } from '../../common/store/ui/actions';
import { getUIBusy } from '../../common/store/ui/selectors';
import { updateProfile } from '../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'ProfilePending'>;
type ScreenRouteProp = RouteProp<UnapprovedParamList, 'ProfilePending'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;
  const { situation } = courier;
  const currentSelfieQuery = useCourierSelfie(courier.id);
  const currentDocumentImageQuery = useCourierDocumentImage(courier.id);

  // screen state
  const { coords } = useLastKnownLocation();
  const situationsAllowed: ProfileSituation[] = ['pending'];
  const hasPersonalInfo = courierInfoSet(courier);
  const hasCompanyInfo = courier.company && companyInfoSet(courier.company);
  const hasImages = !!currentSelfieQuery.data && !!currentDocumentImageQuery.data;
  const hasBankAccount = courier.bankAccount && bankAccountSet(courier.bankAccount);
  const totalSteps = 4;
  const [stepsDone, setStepsDone] = React.useState(0);
  const submitEnabled = situationsAllowed.includes(situation) && stepsDone === totalSteps;
  // side effects
  // tracking
  useSegmentScreen('Profile Pending');
  // when location changes
  React.useEffect(() => {
    if (!coords) return;
    api
      .profile()
      .updateLocation(
        courier.id,
        new firebase.firestore.GeoPoint(coords.latitude, coords.longitude)
      )
      .then(null);
  }, [api, coords, courier.id]);

  // whenever state updates
  // recalculate steps done
  React.useEffect(() => {
    let totalSteps = 0;
    if (hasPersonalInfo) totalSteps++;
    if (hasCompanyInfo) totalSteps++;
    if (hasImages) totalSteps++;
    if (hasBankAccount) totalSteps++;
    setStepsDone(totalSteps);
  }, [hasPersonalInfo, hasCompanyInfo, hasImages, hasBankAccount, setStepsDone]);
  // whenever screen is focused
  React.useEffect(() => {
    navigation.addListener('focus', focusHandler);
    return () => navigation.removeListener('focus', focusHandler);
  });

  // handlers
  const updateProfileHandler = () => {
    (async () => {
      try {
        await dispatch(updateProfile(api)(courier.id, { situation: 'submitted' }));
        track('courier submitted profile');
        navigation.replace('ProfileSubmitted');
      } catch (error: any) {
        Sentry.Native.captureException(error);
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  // when focused, refetch queries to recalculate of steps done
  const focusHandler = React.useCallback(() => {
    queryClient.refetchQueries();
  }, [queryClient]);

  const logOut = () => {
    Alert.alert(
      t('Sair da conta'),
      t(
        'Sua conta não será excluída mas você precisará fazer login novamente para continuar usando o App.'
      ),
      [
        {
          text: t('Cancelar'),
          style: 'cancel',
        },
        {
          text: t('Confirmar'),
          style: 'destructive',
          onPress: () => {
            track('courier logged out');
            api.signOut();
          },
        },
      ]
    );
  };

  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        {/* header */}
        <PaddedView>
          <Text style={{ ...texts.x2l, marginBottom: 24, marginTop: halfPadding }}>
            {t('Cadastro de novo/a\n entregador/a')}
          </Text>
          <DefaultButton
            title={t('Enviar cadastro')}
            onPress={updateProfileHandler}
            disabled={!submitEnabled || busy}
            activityIndicator={busy}
          />
          <Pressable delayLongPress={3000} onLongPress={() => navigation.navigate('ProfileErase')}>
            <Text style={[texts.sm, { color: colors.grey700, paddingTop: 16 }]}>
              {t(
                'Seu cadastro passará por uma análise do nosso sistema para que você possa começar a fazer suas entregas.'
              )}
            </Text>
          </Pressable>
          <Text style={{ ...texts.sm, color: colors.green600, paddingTop: 16 }}>
            {stepsDone} {t('de')} {totalSteps} {t('dados preenchidos')}
          </Text>
        </PaddedView>
        <View
          style={{
            borderBottomColor: colors.grey500,
            borderStyle: 'solid',
            borderBottomWidth: 1,
            // marginTop: 16,
          }}
        />
        <ConfigItem
          title={t('Seus dados')}
          subtitle={t('Preencha seus dados pessoais')}
          onPress={() => navigation.navigate('CommonProfileEdit')}
          checked={courierInfoSet(courier)}
        />
        <ConfigItem
          title={t('Dados da sua empresa')}
          subtitle={t('Preencha os dados da sua empresa ou MEI')}
          onPress={() => navigation.navigate('ProfileCompany')}
          checked={courier.company && companyInfoSet(courier.company)}
        />
        <ConfigItem
          title={t('Fotos e documentos')}
          subtitle={t('Envie uma selfie e seus documentos')}
          onPress={() => navigation.navigate('ProfilePhotos')}
          checked={hasImages}
        />
        <ConfigItem
          title={t('Dados bancários')}
          subtitle={t('Cadastre seu banco para recebimento')}
          onPress={() => navigation.navigate('ProfileBank')}
          checked={courier.bankAccount && bankAccountSet(courier.bankAccount)}
        />
        <TouchableOpacity onPress={logOut}>
          <View style={{ alignItems: 'center', marginTop: 32, height: padding }}>
            <Text style={{ ...texts.xs, color: colors.green600 }}>
              {t('Clique aqui para cancelar ou recomeçar seu cadastro.')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
