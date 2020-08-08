import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';

import { getCourier } from '../../../store/courier/selectors';
import { t } from '../../../strings';
import { ApiContext } from '../../app/context';
import AvoidingView from '../../common/AvoidingView';
import ConfigItem from '../../common/ConfigItem';
import DefaultButton from '../../common/DefaultButton';
import { screens, texts, colors } from '../../common/styles';
import PaddedView from '../../common/views/PaddedView';
import { PendingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<PendingParamList, 'PendingChecklist'>;
type ScreenRouteProp = RouteProp<PendingParamList, 'PendingChecklist'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);

  // state
  const courier = useSelector(getCourier);
  const situation = courier!.info?.situation ?? 'pending';
  const submitEnabled = situation === 'pending' && courier!.personalInfoSet();

  // handlers
  const submitHandler = async () => {
    await api.profile().submitProfile();
  };

  // side effects
  useEffect(() => {
    const feedbackSituations = ['blocked', 'rejected', 'submitted'];
    if (feedbackSituations.indexOf(situation) > -1) {
      navigation.navigate('ProfileFeedback');
    }
  }, [situation]);

  // UI
  return (
    <View style={{ ...screens.configScreen }}>
      <AvoidingView>
        <ScrollView>
          {/* header */}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <PaddedView>
              <Text style={[texts.big]}>{t('Cadastro de novo entregador')}</Text>
              <DefaultButton
                title={t('Enviar cadastro')}
                onPress={submitHandler}
                disabled={!submitEnabled}
              />
              <Text style={[texts.default, { color: colors.darkGrey, paddingTop: 8 }]}>
                {t(
                  'Seu cadastro passará por uma análise do nosso sistema para que você possa começar a fazer suas entregas.'
                )}
              </Text>
            </PaddedView>
          </TouchableWithoutFeedback>

          <PaddedView>
            <ConfigItem
              title={t('Seus dados')}
              subtitle={t('Preencha seus dados pessoais')}
              onPress={() => navigation.navigate('ProfileEdit', { hideDeleteAccount: true })}
              checked={courier!.personalInfoSet()}
            />
            <ConfigItem
              title={t('Fotos e documentos')}
              subtitle={t('Envie uma selfie e seus documentos')}
              onPress={() => navigation.navigate('ProfilePhotos')}
            />
            <ConfigItem
              title={t('Dados bancários')}
              subtitle={t('Cadastre seu banco para recebimento')}
              onPress={() => navigation.navigate('ProfileEdit')}
            />
            {/* <ConfigItem
              title={t('Método de entrega')}
              subtitle={t('Selecione a forma que você vai fazer suas entregas')}
              onPress={() => navigation.navigate('ProfileEdit')}
            /> */}
            <ConfigItem
              title={t('Escolha sua frota')}
              subtitle={t('Faça parte de uma frota existente ou crie sua própria frota.')}
              onPress={() => navigation.navigate('ProfileEdit')}
            />
          </PaddedView>
        </ScrollView>
      </AvoidingView>
    </View>
  );
}
