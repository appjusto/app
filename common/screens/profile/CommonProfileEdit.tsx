import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { RestaurantNavigatorParamList } from '../../../consumer/v2/food/restaurant/types';
import { ProfileParamList } from '../../../consumer/v2/main/profile/types';
import { P2POrderNavigatorParamList } from '../../../consumer/v2/p2p/types';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { CourierProfileParamList } from '../../../courier/approved/main/profile/types';
import { ApprovedParamList } from '../../../courier/approved/types';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../app/context';
import PaddedView from '../../components/containers/PaddedView';
import { getFlavor } from '../../store/config/selectors';
import { getUser } from '../../store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../styles';

export type ProfileEditParamList = {
  CommonProfileEdit: undefined;
};

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    ProfileParamList &
      P2POrderNavigatorParamList &
      RestaurantNavigatorParamList &
      CourierProfileParamList,
    'CommonProfileEdit'
  >,
  StackNavigationProp<ApprovedParamList & UnapprovedParamList & LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<ProfileEditParamList, 'CommonProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const CommonProfileEdit = ({ route }: Props) => {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // app state
  const user = useSelector(getUser)!;
  const flavor = useSelector(getFlavor);

  // consumer
  // const isProfileComplete = isConsumerProfileComplete(consumer);
  // const options = React.useMemo(() => ({ consumerId: consumer.id }), [consumer.id]);
  // const orders = useObserveOrders(options);

  // courier
  // const canSubmit = courierInfoSet(updatedCourier);
  // const profileApproved = courier.situation === 'approved';
  // UI
  if (!user) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  console.log(user, 'user');
  console.log(flavor, 'flavor');
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        <Text
          style={{
            ...texts.x2l,
            paddingBottom: halfPadding,
          }}
        >
          {t('Seus dados')}
        </Text>

        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            paddingBottom: padding,
          }}
        >
          {t('Edite seus dados pessoais:')}
        </Text>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
