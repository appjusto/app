import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FeedbackView from '../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../common/icons/icon-motocycle';
import { getCourier } from '../../common/store/courier/selectors';
import { colors } from '../../common/styles';
import { t } from '../../strings';
import { PendingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<PendingParamList, 'ProfileSubmitted'>;
type ScreenRouteProp = RouteProp<PendingParamList, 'ProfileSubmitted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // state
  const courier = useSelector(getCourier)!;
  // side effects
  useEffect(() => {
    if (courier.situation === 'pending') navigation.replace('ProfilePending');
  }, [courier.situation]);
  // UI
  return (
    <FeedbackView
      header={t('Cadastro enviado')}
      description={t(
        'Estamos analisando seus dados. Em breve você poderá começar a fazer suas entregas. Aguarde sua conta ser aprovada para continuar.'
      )}
      icon={<IconMotocycle circleColor={colors.yellow} />}
    />
  );
}
