import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconMapDestination } from '../../../common/icons/icon-mapDestination';
import { IconMapOrigin } from '../../../common/icons/icon-mapOrigin';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  kind: 'origin' | 'destination';
};

export const AddressCard = ({ kind }: Props) => {
  return (
    <PaddedView
      style={{
        ...borders.default,
        borderColor: colors.grey500,
        flexDirection: 'row',
        borderRadius: padding,
        elevation: 4, // find the right shadow for both platforms
        shadowColor: 'rgba(105, 118, 103, 0.1)', // find the right shadow for both platforms
        shadowOffset: { width: 0, height: 8 }, // find the right shadow for both platforms
      }}
    >
      <View>{kind === 'origin' ? <IconMapOrigin /> : <IconMapDestination />}</View>
      <View>
        <View style={{ marginLeft: padding }}>
          <View style={{ flexDirection: 'row', marginBottom: halfPadding }}>
            <Text style={[texts.bold, texts.sm]}>
              {kind === 'origin' ? t('Retirada') : t('Entrega')}
            </Text>
            <Text style={{ ...texts.xs, marginLeft: padding }}>
              {kind === 'origin' ? t('Retirada') : t('Entrega')}
            </Text>
          </View>
          <View>
            <Text style={{ ...texts.md, flexWrap: 'wrap' }} numberOfLines={3}>
              Rua Benjamim Egas, 167
            </Text>
            <Text style={{ ...texts.md, color: colors.grey700 }}>Pinheiros</Text>
          </View>
        </View>
      </View>
    </PaddedView>
  );
};
