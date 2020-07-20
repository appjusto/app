import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

import { t } from '../../../strings';
import { texts } from '../../common/styles';

export default function () {
  return (
    <SafeAreaView>
      <Text style={[texts.default, { fontSize: 20, lineHeight: 24 }]}>{t('Nova corrida para você!')}</Text>
      <Text style={[texts.huge]}>{t('R$')}</Text>
    </SafeAreaView>
  );
}
