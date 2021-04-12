import React, { ReactNode } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { checklistTick } from '../../../assets/icons';
import { colors, halfPadding, padding, texts } from '../../styles';
import ArrowBox from './ArrowBox';
import ShowIf from './ShowIf';

type Props = {
  title: string;
  subtitle: string;
  checked?: boolean;
  children?: ReactNode;
  bottomBorder?: boolean;
  onPress: () => void;
  leftIcon?: React.ReactNode;
};

export default function ({
  title,
  subtitle,
  checked,
  children,
  bottomBorder = true,
  onPress,
  leftIcon,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          bottomBorder
            ? {
                borderBottomColor: colors.grey500,
                borderStyle: 'solid',
                borderBottomWidth: 1,
              }
            : null,
        ]}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ paddingLeft: padding, paddingTop: 18 }}>{leftIcon}</View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: padding,
                paddingLeft: halfPadding,
                paddingRight: padding,
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  <ShowIf test={checked ?? false}>
                    {() => <Image source={checklistTick} style={{ marginRight: 8 }} />}
                  </ShowIf>
                  <Text style={{ ...texts.sm }}>{title}</Text>
                </View>
                <Text
                  style={{
                    ...texts.sm,
                    color: colors.grey700,
                    flexWrap: 'wrap',
                  }}
                >
                  {subtitle}
                </Text>
              </View>
              <View style={{ marginLeft: padding }}>
                <ArrowBox />
              </View>
            </View>
            {children && (
              <View
                style={{ paddingRight: padding, paddingBottom: padding, paddingLeft: halfPadding }}
              >
                {children}
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
