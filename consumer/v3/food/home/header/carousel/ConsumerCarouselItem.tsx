import React from 'react';
import { View, ViewProps } from 'react-native';
import { padding } from '../../../../../../common/styles';
import { borderRadius2 } from '../../../../common/styles/borders';
import { colors } from '../../../../common/styles/colors';
import { padding4, padding5 } from '../../../../common/styles/padding';

interface Props extends ViewProps {
  icon: React.ReactNode;
}

export const ConsumerCarouselItem = ({ children, icon, style }: Props) => {
  return (
    <View
      style={[
        {
          width: 280,
          marginLeft: padding4,
          padding: padding5,
          backgroundColor: colors.grey50,
          borderRadius: borderRadius2,
          // borderWidth: 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.grey50 }}>
        {icon ? (
          <View style={{ justifyContent: 'center', marginRight: padding }}>{icon}</View>
        ) : null}
        <View style={{ flexShrink: 1 }}>{children}</View>
      </View>
    </View>
  );
};
