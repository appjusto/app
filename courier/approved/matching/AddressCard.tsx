import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import { IconMapOrigin } from '../../../common/icons/icon-mapOrigin';
import { IconPinPackageWhite } from '../../../common/icons/icon-pin';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  kind: 'origin' | 'destination';
  distance: number;
  address: string;
};

export const AddressCard = ({ kind, distance, address }: Props) => {
  return (
    <PaddedView
      style={{
        ...borders.default,
        borderColor: colors.grey500,
        flexDirection: 'row',
        borderRadius: padding,
        elevation: 4, // find the right shadow for both platforms
        shadowColor: 'rgba(105, 118, 103, 0.1)',
        shadowOffset: { width: 0, height: 8 }, // find the right shadow for both platforms
        alignItems: 'flex-start',
      }}
    >
      <View>{kind === 'origin' ? <IconPinPackageWhite /> : <IconMapOrigin />}</View>
      <View>
        <View style={{ marginLeft: padding }}>
          <View style={{ flexDirection: 'row', marginBottom: halfPadding }}>
            <Text style={[texts.bold, texts.sm]}>
              {kind === 'origin' ? t('Retirada') : t('Entrega')}
            </Text>
            <RoundedText
              style={{ ...texts.xs, marginLeft: halfPadding, bottom: 3 }}
              color={kind === 'origin' ? colors.black : colors.white}
              backgroundColor={kind === 'origin' ? colors.grey50 : colors.grey700}
              noBorder
            >
              {distance}
            </RoundedText>
          </View>
          <View>
            <Text style={{ ...texts.md, flexWrap: 'wrap' }} numberOfLines={3}>
              {address}
            </Text>
            <Text style={{ ...texts.md, color: colors.grey700 }}>Pinheiros</Text>
          </View>
        </View>
      </View>
    </PaddedView>
  );
};
