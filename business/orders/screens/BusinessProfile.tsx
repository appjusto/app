import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getManager } from '../../../common/store/business/selectors';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessAppContext } from '../../BusinessAppContext';
import { BusinessNavParamsList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'BusinessProfile'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'BusinessProfile'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const BusinessProfile = ({ navigation, route }: Props) => {
  // context
  const { business } = React.useContext(BusinessAppContext);
  // redux
  const manager = useSelector(getManager);
  // tracking
  useSegmentScreen('BusinessOptions');
  //UI
  if (business === undefined || manager === undefined) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
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
        <Text style={{ ...texts.x2l, paddingBottom: padding }}>{t('Dados do restaurante:')}</Text>
        <View>
          <DefaultInput
            title={t('Nome')}
            editable={false}
            value={business.name}
            style={{ flexWrap: 'wrap' }}
          />
          <DefaultInput
            title={t('E-mail')}
            style={{ marginTop: padding, flexWrap: 'wrap' }}
            editable={false}
            value={manager.email}
          />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
