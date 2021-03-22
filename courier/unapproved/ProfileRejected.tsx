import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../assets/icons';
import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import FeedbackView from '../../common/components/views/FeedbackView';
import { getCourier } from '../../common/store/courier/selectors';
import { showToast } from '../../common/store/ui/actions';
import { getUIBusy } from '../../common/store/ui/selectors';
import { updateProfile } from '../../common/store/user/actions';
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
  // app state
  const courier = useSelector(getCourier)!;
  const busy = useSelector(getUIBusy);
  // side effects
  React.useEffect(() => {
    if (courier.situation === 'pending') navigation.replace('ProfilePending');
    else if (courier.situation === 'submitted') navigation.replace('ProfileSubmitted');
  }, [courier.situation, navigation]);
  // handlers
  const updateProfileHandler = () => {
    (async () => {
      try {
        await dispatch(updateProfile(api)(courier.id, { situation: 'pending' }));
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  // UI
  return (
    <FeedbackView
      header={t('Seu cadastro foi recusado :(')}
      description={courier.profileIssues?.join('\n') ?? 'Entre em contato com nosso suporte.'}
      icon={<Image source={icons.coneYellow} />}
    >
      <DefaultButton
        title={t('Editar cadastro')}
        onPress={updateProfileHandler}
        secondary
        activityIndicator={busy}
        disabled={busy}
      />
    </FeedbackView>
  );
}
