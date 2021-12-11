import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import FeedbackView from '../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../common/icons/icon-cone-yellow';
import { track, useSegmentScreen } from '../../common/store/api/track';
import { getCourier } from '../../common/store/courier/selectors';
import { showToast } from '../../common/store/ui/actions';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'ProfileRejected'>;
type ScreenRouteProp = RouteProp<UnapprovedParamList, 'ProfileRejected'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const courier = useSelector(getCourier)!;
  // state
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('ProfileRejected');
  // adapting to situation changes
  React.useEffect(() => {
    if (courier.situation === 'pending') navigation.replace('ProfilePending');
    else if (courier.situation === 'submitted') navigation.replace('ProfileSubmitted');
  }, [courier.situation, navigation]);
  // handlers
  const updateProfileHandler = () => {
    (async () => {
      try {
        setLoading(true);
        await api.profile().updateProfile(courier.id, { situation: 'pending' });
        track('courier situation updated to pending');
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        Sentry.Native.captureException(error);
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  // UI
  return (
    <FeedbackView
      header={t('Seu cadastro foi recusado :(')}
      description={courier.profileIssues?.join('\n') ?? t('Entre em contato com nosso suporte.')}
      icon={<IconConeYellow />}
    >
      <DefaultButton
        title={t('Editar cadastro')}
        onPress={updateProfileHandler}
        secondary
        activityIndicator={isLoading}
        disabled={isLoading}
      />
    </FeedbackView>
  );
}
