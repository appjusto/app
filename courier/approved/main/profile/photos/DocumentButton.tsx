import React from 'react';
import { ButtonProps, Text, TouchableOpacity, View } from 'react-native';
import useTallerDevice from '../../../../../common/hooks/useTallerDevice';
import { borders, colors, padding } from '../../../../../common/styles';

interface Props extends ButtonProps {
  children: React.ReactNode;
  hasTitle: boolean;
}
export default function ({ children, title, onPress, hasTitle }: Props) {
  const tallerDevice = useTallerDevice();
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: tallerDevice ? 160 : 152,
          height: tallerDevice ? 160 : 152,
          backgroundColor: colors.grey50,
          ...borders.default,
          borderColor: colors.white,
          borderRadius: tallerDevice ? 80 : 76,
          // padding,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
        {hasTitle && <Text style={{ marginTop: padding }}>{title}</Text>}
      </View>
    </TouchableOpacity>
  );
}
