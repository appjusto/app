import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import ConfigItem from '../../common/components/views/ConfigItem';
import {
  submitProfile,
  getDocumentImageURL,
  getSelfieURL,
} from '../../common/store/courier/actions';
import { getCourier } from '../../common/store/courier/selectors';
import {
  courierInfoSet,
  bankAccountSet,
  companyInfoSet,
} from '../../common/store/courier/validators';
import { getUIBusy } from '../../common/store/ui/selectors';
import { screens, texts, colors } from '../../common/styles';
import { t } from '../../strings';
import { PendingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<PendingParamList, 'PendingChecklist'>;
type ScreenRouteProp = RouteProp<PendingParamList, 'PendingChecklist'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;
  const hasPersonalInfo = courierInfoSet(courier);
  const hasCompanyInfo = companyInfoSet(courier);
  const hasBankAccount = bankAccountSet(courier);
  const hasSelectedFleet = courier.fleet !== undefined;
  const totalSteps = 5;

  // screen state
  const [hasImagesUris, setHasImagesUris] = useState(false);
  const submitEnabled =
    courier.situation === 'pending' &&
    hasPersonalInfo &&
    hasCompanyInfo &&
    hasBankAccount &&
    hasImagesUris &&
    hasSelectedFleet;
  const [stepsDone, setStepsDone] = useState(0);

  // handlers
  const submitHandler = async () => {
    await dispatch(submitProfile(api));
  };

  // side effects
  useEffect(() => {
    const feedbackSituations = ['blocked', 'rejected', 'submitted'];
    if (feedbackSituations.indexOf(courier.situation) > -1) {
      navigation.navigate('ProfileFeedback');
    }
  }, [courier.situation]);

  useEffect(() => {
    navigation.addListener('focus', focusHandler);
    return () => navigation.removeListener('focus', focusHandler);
  });

  // handler
  const focusHandler = useCallback(() => {
    (async () => {
      try {
        let hasImages = hasImagesUris;
        if (!hasImages) {
          const documentImageUri = await dispatch(getDocumentImageURL(api)(courier.id!));
          const selfieUri = await dispatch(getSelfieURL(api)(courier.id!));
          hasImages = documentImageUri !== null && selfieUri !== null;
        }
        let totalSteps = 0;
        if (hasPersonalInfo) totalSteps++;
        if (hasCompanyInfo) totalSteps++;
        if (hasImages) totalSteps++;
        if (hasBankAccount) totalSteps++;
        if (hasSelectedFleet) totalSteps++;
        setStepsDone(totalSteps);
        setHasImagesUris(hasImages);
      } catch (error) {}
    })();
  }, [hasImagesUris, hasPersonalInfo, hasBankAccount, hasSelectedFleet, api]);

  // UI
  return (
    <View style={{ ...screens.configScreen }}>
      <ScrollView>
        {/* header */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ ...texts.big, marginBottom: 24 }}>
              {t('Cadastro de novo entregador')}
            </Text>
            <DefaultButton
              title={t('Enviar cadastro')}
              onPress={submitHandler}
              disabled={!submitEnabled || busy}
              activityIndicator={busy}
            />
            <Text style={[texts.default, { color: colors.darkGrey, paddingTop: 16 }]}>
              {t(
                'Seu cadastro passará por uma análise do nosso sistema para que você possa começar a fazer suas entregas.'
              )}
            </Text>
            <Text style={{ ...texts.default, color: colors.darkGreen, paddingTop: 16 }}>
              {stepsDone} {t('de')} {totalSteps} {t('dados preenchidos')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            borderBottomColor: colors.grey,
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
          checked={companyInfoSet(courier)}
        />
        <ConfigItem
          title={t('Fotos e documentos')}
          subtitle={t('Envie uma selfie e seus documentos')}
          onPress={() => navigation.navigate('ProfilePhotos')}
          checked={hasImagesUris}
        />
        <ConfigItem
          title={t('Dados bancários')}
          subtitle={t('Cadastre seu banco para recebimento')}
          onPress={() => navigation.navigate('Bank')}
          checked={bankAccountSet(courier)}
        />
        <ConfigItem
          title={t('Escolha sua frota')}
          subtitle={t('Faça parte de uma frota existente ou crie sua própria frota')}
          onPress={() => navigation.navigate('Fleet')}
          checked={hasSelectedFleet}
        />
      </ScrollView>
    </View>
  );
}
