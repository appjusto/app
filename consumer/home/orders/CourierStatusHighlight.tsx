import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import * as icons from '../../../assets/icons';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';

type Props = {
  title: string;
  subtitle: string;
};

export default function ({ title, subtitle }: Props) {
  // context
  const tallerDevice = useTallerDevice();

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={[
          styles.card,
          {
            padding: tallerDevice ? padding : halfPadding,
            marginBottom: tallerDevice ? padding : halfPadding,
            position: 'absolute',
            bottom: halfPadding,
            width: '95%',
            // marginHorizontal: tallerDevice ? padding : halfPadding,
          },
        ]}
      >
        <View style={{ height: 64, width: 64, borderRadius: 32, backgroundColor: colors.white }}>
          <Image source={icons.motocycleWhite} />
        </View>
        <View style={{ marginLeft: padding }}>
          <Text style={{ ...texts.default }}>{title}</Text>
          <Text
            style={{
              ...texts.small,
              color: colors.darkGrey,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...borders.default,
    borderColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.yellow,
  },
});
