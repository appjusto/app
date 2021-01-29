import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
            width: '100%',
            // marginHorizontal: tallerDevice ? padding : halfPadding,
          },
        ]}
      >
        <View style={{ height: 64, width: 64, borderRadius: 32, backgroundColor: colors.white }}>
          <Image source={icons.motocycleWhite} />
        </View>
        <View style={{ marginLeft: padding, flex: 1 }}>
          <Text style={{ ...texts.default }}>{title}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...texts.small,
                color: colors.darkGrey,
                flexWrap: 'wrap',
              }}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          </View>
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
