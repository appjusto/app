import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { borders, colors, halfPadding, padding, texts } from '../../../../../common/styles';

interface Props {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
export const HomeControlItem = ({ title, subtitle, icon, onPress }: Props) => {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        flexDirection: 'row',
        ...borders.default,
        borderColor: colors.white,
        width: Math.floor((width - 3 * padding) / 2),
        paddingHorizontal: 12,
        paddingBottom: 12,
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View>
          {icon}
          <Text style={[texts.sm, { paddingTop: 4 }]}>{title}</Text>
          <Text style={[texts.xs, { paddingTop: halfPadding, color: colors.grey700 }]}>
            {subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
