import React, { ReactNode } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';

import { checklistTick } from '../../assets/icons';
import { colors, texts, padding } from '../styles';
import ArrowBox from './ArrowBox';
import PaddedView from './views/PaddedView';
import ShowIf from './views/ShowIf';

type Props = {
  title: string;
  subtitle: string;
  checked?: boolean | Promise<boolean>;
  children?: ReactNode;
  bottomBorder?: boolean;
  onPress: () => void;
};

export default function ({
  title,
  subtitle,
  checked,
  children,
  bottomBorder = true,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          bottomBorder
            ? {
                borderBottomColor: colors.grey,
                borderStyle: 'solid',
                borderBottomWidth: 1,
              }
            : null,
        ]}
      >
        <PaddedView
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <ShowIf test={checked ?? false}>
                {() => <Image source={checklistTick} style={{ marginRight: 8 }} />}
              </ShowIf>
              <Text style={{ ...texts.default }}>{title}</Text>
            </View>
            <Text
              style={{
                ...texts.default,
                color: colors.darkGrey,
                flexWrap: 'wrap',
              }}
            >
              {subtitle}
            </Text>
          </View>
          <View style={{ marginLeft: padding }}>
            <ArrowBox />
          </View>
        </PaddedView>
        {children}
      </View>
    </TouchableOpacity>
  );
}
