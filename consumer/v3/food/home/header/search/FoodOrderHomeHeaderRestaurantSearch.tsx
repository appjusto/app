import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as icons from '../../../../../../assets/icons';
import PaddedView from '../../../../../../common/components/containers/PaddedView';
import { padding } from '../../../../../../common/styles';
import { borders } from '../../../../common/styles/borders';
import { colors } from '../../../../common/styles/colors';
import { texts } from '../../../../common/styles/fonts';
import { DoubleHeaderV3 } from '../../../../common/texts/DoubleHeaderV3';
interface Props {
  onSearchPress: () => void;
}

export const FoodOrderHomeHeaderRestaurantSearch = ({ onSearchPress }: Props) => {
  return (
    <View>
      <PaddedView>
        <DoubleHeaderV3
          title="Já sabe o que quer?"
          subtitle="Pesquise pelo seu restaurante ou prato preferido"
        />
        <View style={{ marginTop: padding }}>
          <Pressable onPress={onSearchPress}>
            <View
              style={{
                height: 54,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                ...borders.rounder,
                borderColor: colors.black,
              }}
            >
              <Text style={{ ...texts.sm, color: colors.grey700 }}>
                Buscar por prato ou restaurante
              </Text>
              <Image source={icons.search} />
            </View>
          </Pressable>
        </View>
      </PaddedView>
    </View>
  );
};
