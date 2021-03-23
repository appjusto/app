import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderNoMatch'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderNoMatch'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderNoMatch = ({ navigation, route }: Props) => {
  // params
  // const { orderId } = route.params ?? {};
  // redux
  const busy = useSelector(getUIBusy);
  // UI
  return (
    <FeedbackView
      header={t('Sem entregadores na região :(')}
      description={t(
        'Infelizmente não encontramos nenhum entregador disponível. Tente novamente mais tarde.'
      )}
      icon={<Image source={icons.coneYellow} />}
    >
      {/* TODO: start matching again */}
      <DefaultButton
        title={t('Tentar novamente')}
        onPress={() => null}
        activityIndicator={busy}
        disabled={busy}
        style={{
          ...borders.default,
          marginBottom: padding,
          borderColor: colors.black,
          backgroundColor: 'white',
        }}
      />
      <DefaultButton
        title={t('Voltar para o início')}
        onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
      />
    </FeedbackView>
  );
};
