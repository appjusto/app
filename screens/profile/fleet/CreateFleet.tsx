import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import DefaultInput from '../../common/DefaultInput';
import { texts, screens, colors } from '../../common/styles';

export default function () {
  return (
    <View style={{ ...screens.configScreen, paddingVertical: 16, paddingHorizontal: 16 }}>
      <Text>Create Fleet</Text>
    </View>
  )
};