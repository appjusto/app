import React, { useEffect, useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, ApiContext } from '../common/app/context';
import { getFlavor } from '../common/store/config/selectors';
import { getCourier } from '../common/store/courier/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { colors, screens } from '../common/styles';
import ApprovedNavigator from './approved/ApprovedNavigator';
import UnapprovedNavigator from './unapproved/UnapprovedNavigator';

export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const courier = useSelector(getCourier);
  const situation = courier?.situation;

  // side effects
  // once
  // subscribe for profile changes
  useEffect(() => {
    return dispatch(observeProfile(api)(flavor, user!.uid));
  }, []);
  // UI
  if (!situation) {
    // showing the indicator until the profile is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  } else if (situation === 'approved') {
    return <ApprovedNavigator />;
  }

  return <UnapprovedNavigator />;
}
