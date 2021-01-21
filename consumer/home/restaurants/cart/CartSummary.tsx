import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HR from '../../../../common/components/views/HR';
import { colors, padding, screens } from '../../../../common/styles';
import SingleHeader from '../SingleHeader';
import { RestaurantsNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'CartSummary'>;

export default function () {
  return (
    <ScrollView style={{ ...screens.default }}>
      <PaddedView>
        {/* <PlaceSummary
        title={t('Entregar em')}
        place={origin}
        editStepHandler={() => editStepHandler(0)}
      /> */}
      </PaddedView>
      <HR height={padding} />
      <SingleHeader title="Nome do restaurante" />
      <View
        style={{
          width: '100%',
          borderBottomWidth: 1,
          borderBottomColor: colors.grey,
          borderStyle: 'solid',
        }}
      />
      <HR height={padding} />
    </ScrollView>
  );
}
