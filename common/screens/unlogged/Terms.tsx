import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTerms } from '../../store/api/platform/hooks/useTerms';
import { colors, padding, screens } from '../../styles';

export default function Terms() {
  const terms = useTerms();
  // UI
  if (!terms) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: terms }}
      containerStyle={{
        // backgroundColor: colors.grey50,
        backgroundColor: colors.white,
        paddingHorizontal: padding,
        paddingBottom: 20,
      }}
      style={{}}
    />
  );
}
