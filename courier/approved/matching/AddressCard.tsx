import React from 'react';
import { Text, View, ViewProps } from 'react-native';
import RoundedText from '../../../common/components/texts/RoundedText';
import { IconMapOrigin } from '../../../common/icons/icon-mapOrigin';
import { IconPinPackageWhite } from '../../../common/icons/icon-pin';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ViewProps {
  kind: 'origin' | 'destination';
  distance: string;
  address: string;
}

export const AddressCard = ({ kind, distance, address }: Props) => {
  // helpers
  let [main, secondary] = address.includes('-') ? address.split('-') : [address, ''];
  [main] = main.includes(',') ? main.split(',') : [main];
  [secondary] = secondary.includes('-') ? secondary.split('-') : [secondary]; // just in case we decide to bring the neighboorhood back
  const distanceDescription =
    kind === 'origin' ? `${distance} ${t('até retirada')}` : `+ ${distance} ${t('até entrega')}`;
  return (
    <View style={{ paddingHorizontal: padding, paddingTop: padding, width: '100%' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <View>{kind === 'origin' ? <IconPinPackageWhite /> : <IconMapOrigin />}</View>
        <View style={{ width: '90%' }}>
          <View style={{ marginLeft: padding }}>
            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={[texts.sm, texts.bold]}>
                {kind === 'origin' ? t('Retirada') : t('Entrega')}
              </Text>
              <RoundedText
                style={{ ...texts.xs, marginLeft: halfPadding, bottom: 3 }}
                color={kind === 'origin' ? colors.black : colors.white}
                backgroundColor={kind === 'origin' ? colors.grey50 : colors.grey700}
                noBorder
              >
                {distanceDescription}
              </RoundedText>
            </View>
            <View style={{ width: '96%' }}>
              <Text style={{ ...texts.md, flexWrap: 'wrap' }} numberOfLines={3}>
                {main}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
