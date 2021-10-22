import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import FeedbackView from '../../components/views/FeedbackView';
import { IconConeYellow } from '../../icons/icon-cone-yellow';
import { useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';

type ScreenNavigationProp = StackNavigationProp<
  UnapprovedParamList & LoggedNavigatorParamList,
  'ProfileBlocked'
>;
type ScreenRouteProp = RouteProp<UnapprovedParamList & LoggedNavigatorParamList, 'ProfileBlocked'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // redux
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const flavor = useSelector(getFlavor);
  const profile = flavor === 'consumer' ? consumer : courier;
  // side effects
  // tracking
  useSegmentScreen('ProfileBlocked');
  // adapting to situation changes
  React.useEffect(() => {
    if (profile?.situation === 'pending') navigation.replace('ProfilePending');
    else if (profile?.situation === 'submitted') navigation.replace('ProfileSubmitted');
  }, [profile?.situation, navigation]);
  // UI
  return (
    <FeedbackView
      header={t('Seu cadastro está bloqueado :(')}
      description={profile?.profileIssues?.join('\n') ?? t('Entre em contato com nosso suporte.')}
      icon={<IconConeYellow />}
    />
  );
}
