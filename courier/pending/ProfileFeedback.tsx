import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { motocycle } from '../../assets/icons';
import FeedbackView from '../../common/components/views/FeedbackView';
import { getCourier } from '../../common/store/courier/selectors';
import { t } from '../../strings';
import { PendingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<PendingParamList, 'ProfileFeedback'>;
type ScreenRouteProp = RouteProp<PendingParamList, 'ProfileFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // state
  const courier = useSelector(getCourier);
  const situation = courier!.situation ?? null;
  let header = '';
  let description = '';
  const icon = motocycle;
  if (situation === 'submitted') {
    header = t('Cadastro enviado');
    description = t(
      'Estamos analisando seus dados. Em breve você poderá começar a fazer suas entregas. Aguarde sua conta ser aprovada para continuar.'
    );
  }

  // side effects
  useEffect(() => {
    if (situation === 'pending') navigation.goBack();
  }, [situation]);
  // UI
  return <FeedbackView header={header} description={description} icon={icon} />;
}
