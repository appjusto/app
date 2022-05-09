import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PaddedView from '../../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../../common/store/api/track';
import { padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessNavParamsList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'BusinessProfile'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'BusinessProfile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const BusinessProfile = ({ navigation, route }: Props) => {
  // tracking
  useSegmentScreen('BusinessOptions');
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
      <PaddedView style={{ flex: 1 }}>
        <Text style={{ ...texts.x2l, paddingBottom: padding }}>{t('Dados do restaurante')}</Text>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
