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
  distance: string;
  address: string;
};

export const AddressCard = ({ kind, distance, address }: Props) => {
  // helpers
  let [main, secondary] = address.includes('-') ? address.split('-') : [address, ''];
  [secondary] = secondary.includes('-') ? secondary.split('-') : [secondary];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white, // it looks like we need to set a backgroundColor for the shadow to be applied only in the parent
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 16 },
        shadowRadius: padding,
        elevation: 8,
        shadowColor: 'rgba(105, 118, 103, 0.1)',
        borderRadius: padding,
      }}
    >
      <PaddedView
        style={{
          ...borders.default,
          borderColor: colors.grey500,
          flexDirection: 'row',
          borderRadius: padding,
          alignItems: 'flex-start',
        }}
      >
        <View>{kind === 'origin' ? <IconPinPackageWhite /> : <IconMapOrigin />}</View>
        <View>
          <View style={{ marginLeft: padding }}>
            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
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
              <Text style={{ ...texts.md, flexWrap: 'wrap', maxWidth: '95%' }} numberOfLines={3}>
                {main}
              </Text>
              <Text
                style={{ ...texts.md, color: colors.grey700, flexWrap: 'wrap', maxWidth: '95%' }}
              >
                {secondary.trim()}
              </Text>
            </View>
          </View>
        </View>
      </PaddedView>
    </View>
  );
};
