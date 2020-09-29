import React from 'react';
import { Text, FlatList, View, ActivityIndicator } from 'react-native';

import { texts, screens, colors, padding } from '../../../../common/styles';
import { t } from '../../../../strings';

export default function () {
  return (
    <View style={{ ...screens.configScreen }}>
      <Text>{t('Todas as frotas disponíveis')}</Text>
    </View>
  );
}
