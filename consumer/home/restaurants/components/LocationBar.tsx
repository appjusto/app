import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../../assets/icons';
import { borders, colors, halfPadding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  address: string;
  onPress?: () => void;
};

export default function ({ address, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...borders.default,
          backgroundColor: colors.lightGrey,
          width: '100%',
          height: 42,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          borderRadius: 32,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icons.navigationArrow} />
          <Text style={{ ...texts.small, marginLeft: halfPadding }}>{address}</Text>
        </View>
        <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Alterar')}</Text>
      </View>
    </TouchableOpacity>
  );
}
