import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, halfPadding, texts } from '../../../common/styles';

export const RemainingTime = () => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons name="access-alarm" size={14} />
        {/* remaining cooking time */}
        <Text style={[texts.xs, texts.bold, { marginLeft: 4, marginRight: halfPadding }]}>
          10 min
        </Text>
        {/* cooking time */}
        <Text style={[texts.xs, { color: colors.grey700 }]}>15</Text>
      </View>
      {/* progress bar */}
      <View
        style={{
          height: halfPadding,
          width: '100%',
          borderRadius: 8,
          backgroundColor: colors.grey500,
        }}
      />
    </View>
  );
};
