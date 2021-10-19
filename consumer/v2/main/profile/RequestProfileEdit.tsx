import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'RequestProfileEdit'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'RequestProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RequestProfileEdit = ({ navigation, route }: Props) => {
  // app state
  const consumer = useSelector(getConsumer)!;
  //TODO: rememeber Keyboard.dismiss() in the handler
  //UI
  if (!consumer) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <KeyboardAwareScrollView
      style={{ ...screens.config }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
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
          {t('Edite seus dados pessoais')}
        </Text>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
