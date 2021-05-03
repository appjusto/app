import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileSituation } from 'appjusto-types';
import firebase from 'firebase';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import useLastKnownLocation from '../../common/hooks/useLastKnownLocation';
import useCourierDocumentImage from '../../common/store/api/courier/hooks/useCourierDocumentImage';
import useCourierSelfie from '../../common/store/api/courier/hooks/useCourierSelfie';
import { useSegmentScreen } from '../../common/store/api/track';
import { getCourier } from '../../common/store/courier/selectors';
import {
  bankAccountSet,
  companyInfoSet,
  courierInfoSet,
} from '../../common/store/courier/validators';
import { showToast } from '../../common/store/ui/actions';
import { getUIBusy } from '../../common/store/ui/selectors';
import { updateProfile } from '../../common/store/user/actions';
import { colors, halfPadding, screens, texts } from '../../common/styles';
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
  const submitEnabled = situationsAllowed.includes(courier.situation) && stepsDone === totalSteps;
  // side effects
  // tracking
  useSegmentScreen('Profile Pending');
  // once
  React.useEffect(() => {
    // although this screen is named 'ProfilePending', it's also the first screen of UnapprovedNavigator
    // which means that it will be shown if courier is rejected. so, if that's the case,
    // we navigate to ProfileRejected after a short delay to make sure it will work on all devices
    if (
      courier.situation === 'submitted' ||
      courier.situation === 'verified' ||
      courier.situation === 'invalid'
    ) {
      setTimeout(() => {
        navigation.replace('ProfileSubmitted');
      }, 100);
    } else if (courier.situation === 'rejected') {
      setTimeout(() => {
        navigation.replace('ProfileRejected');
      }, 100);
    }
  }, [courier, navigation]);
  // when location changes
  React.useEffect(() => {
    if (!coords) return;
    api
      .profile()
      .updateLocation(
        courier.id,
        new firebase.firestore.GeoPoint(coords.latitude, coords.longitude)
      );
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
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  // when focused, refetch queries to recalculate of steps done
  const focusHandler = React.useCallback(() => {
    queryClient.refetchQueries();
  }, [queryClient]);

  // UI
  return (
    <View style={[screens.config, screens.headless]}>
      <ScrollView>
        {/* header */}
        <PaddedView>
          <Text style={{ ...texts.x2l, marginBottom: 24, marginTop: halfPadding }}>
            {t('Cadastro de novo entregador')}
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
          onPress={() => navigation.navigate('ProfileEdit')}
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
      </ScrollView>
    </View>
  );
}
