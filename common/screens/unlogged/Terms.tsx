import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTerms } from '../../store/api/platform/hooks/useTerms';
import { useSegmentScreen } from '../../store/api/track';
import { colors, padding, screens } from '../../styles';

export default function Terms() {
  // state
  const terms = useTerms();
  // side effects
  useSegmentScreen('Terms');
  // UI
  if (!terms) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  const head =
    '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>';
  const html = `<html>${head}<body>${terms}</body></html>`;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
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
