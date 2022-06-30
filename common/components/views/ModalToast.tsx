import { Feather, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Platform, Text, View } from 'react-native';
import { useModalToastContext } from '../../contexts/ModalToastContext';
import { colors, halfPadding, texts } from '../../styles';

const duration = 250;

export const ModalToast = () => {
  // context
  // context
  const { modalToastConfig, hideModalToast } = useModalToastContext();
  // state
  const [opacity] = React.useState(new Animated.Value(0));
  // side effects
  React.useEffect(() => {
    if (!modalToastConfig) return;
    const timer = setTimeout(hideModalToast, modalToastConfig.duration);
    return () => clearTimeout(timer);
  }, [modalToastConfig, hideModalToast]);

  if (!modalToastConfig) return null;

  //helpers
  Animated.sequence([
    Animated.timing(opacity, {
      useNativeDriver: false,
      toValue: 1,
      duration,
    }),
    Animated.timing(opacity, {
      useNativeDriver: false,
      delay: modalToastConfig.duration,
      toValue: 0,
      duration,
    }),
  ]).start(() => hideModalToast());

  const { type, message } = modalToastConfig;

  // UI
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'android' ? 0 : 4,
        opacity,
        width: '100%',
        minHeight: 48,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: type === 'success' ? colors.green100 : colors.yellow,
          width: '100%',
          // flexWrap: 'wrap',
          padding: halfPadding,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <View>
          {type === 'success' ? (
            <View style={{ marginRight: halfPadding }}>
              <Feather name="check" size={16} />
            </View>
          ) : (
            <View style={{ marginRight: halfPadding }}>
              <MaterialIcons name="close" size={16} />
            </View>
          )}
        </View>
        <View style={{ maxWidth: '90%' }}>
          <Text style={{ ...texts.xs, flexWrap: 'wrap' }} numberOfLines={3}>
            {message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
