import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'OrderMatching'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderMatching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // context
  const { orderId } = route.params ?? {};

  // app state
  const busy = useSelector(getUIBusy);
  // const order = useSelector(getOrderById)(orderId);

  // UI
  return (
    <FeedbackView
      header={t('Sem entregadores na região :(')}
      description={t(
        'Infelizmente não encontramos nenhum entregador disponível. Tente novamente mais tarde.'
      )}
      icon={icons.coneYellow}
    >
      <DefaultButton
        title={t('Tentar novamente')}
        onPress={() => navigation.navigate('OrderMatching', { orderId })}
        activityIndicator={busy}
        disabled={busy}
        style={{
          ...borders.default,
          marginBottom: padding,
          borderColor: colors.black,
          backgroundColor: 'white',
        }}
      />
      <DefaultButton title={t('Voltar para o início')} onPress={() => navigation.popToTop()} />
    </FeedbackView>
  );
};
