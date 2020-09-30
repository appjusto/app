import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React, { useEffect, useContext } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../common/app/context';
import PaddedView from '../../../common/components/containers/PaddedView';
import ShowIf from '../../../common/components/views/ShowIf';
import useNotificationToken from '../../../common/hooks/useNotificationToken';
import { getCourier } from '../../../common/store/courier/selectors';
import { updateProfile } from '../../../common/store/user/actions';
import { padding } from '../../../common/styles';
import { ApprovedParamList } from '../types';
import HomeControls from './HomeControls';
import HomeDeliveriesSummary from './HomeDeliveriesSummary';
import ModalChooser from './ModalChooser';
import { HomeParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeParamList, 'Home'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const courier = useSelector(getCourier)!;

  // state
  const [notificationToken, notificationError] = useNotificationToken();

  // side effects
  // notification permission
  useEffect(() => {
    // cases that we need to update token:
    // some error ocurred; token is not valid (null); token is different from what's on the backend
    const shouldDeleteToken = notificationError !== null || notificationToken === null;
    const shouldUpdateToken =
      !shouldDeleteToken && notificationToken !== courier!.notificationToken;
    if (shouldDeleteToken || shouldUpdateToken) {
      const token = shouldUpdateToken ? notificationToken : null;
      dispatch(updateProfile(api)(courier.id, { notificationToken: token }));
    }
  }, [courier, notificationToken, notificationError]);

  // UI
  const paddingTop = Constants.statusBarHeight;
  return (
    <ScrollView contentContainerStyle={{ paddingTop }}>
      <HomeControls navigation={navigation} />
      <ShowIf test>{() => <PaddedView half />}</ShowIf>
      <PaddedView half>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Deliveries' })}>
          <HomeDeliveriesSummary />
        </TouchableOpacity>
      </PaddedView>
      <PaddedView vertical={false} style={{ marginBottom: padding }} half>
        <ModalChooser />
      </PaddedView>
    </ScrollView>
  );
}
