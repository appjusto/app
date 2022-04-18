import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../common/app/context';
import { getCourier } from '../common/store/courier/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { colors, screens } from '../common/styles';
import ApprovedNavigator from './approved/ApprovedNavigator';
import { ProfileIssuesNavigator } from './ProfileIssuesNavigator';
import UnapprovedNavigator from './unapproved/UnapprovedNavigator';

export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  const courier = useSelector(getCourier);
  const situation = courier?.situation;
  const courierId = user?.uid;
  // side effects
  // once
  // subscribe for profile changes
  React.useEffect(() => {
    if (!courierId) return;
    return dispatch(observeProfile(api)('courier', courierId));
  }, [api, dispatch, courierId]);
  // UI
  if (!situation) {
    // showing the indicator until the profile is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  } else if (situation === 'approved') {
    return <ApprovedNavigator />;
  } else if (situation === 'blocked' || situation === 'deleted' || situation === 'rejected') {
    return <ProfileIssuesNavigator />;
  }
  return <UnapprovedNavigator />;
}
