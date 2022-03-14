import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import { useBusinessLogoURI } from '../../../common/store/api/business/hooks/useBusinessLogoURI';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { ListItemImage } from '../../../consumer/v2/food/common/ListItemImage';
import { t } from '../../../strings';

type Props = {
  business: WithId<Business>;
};

export const OrderManagerHeader = ({ business }: Props) => {
  // context
  const { data: logo } = useBusinessLogoURI(business.id);
  // helpers
  const businessStatus =
    business.status === 'open' ? t('RESTAURANTE ABERTO') : t('RESTAURANTE FECHADO');
  return (
    <View
      style={{ height: 48, width: '100%', flexDirection: 'row', backgroundColor: colors.white }}
    >
      <View
        style={{
          height: 48,
          width: 48,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.black,
          marginRight: padding,
        }}
      >
        <ListItemImage uri={logo} height={48} width={48} />
      </View>
      <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
        <Text style={{ ...texts.lg }}>{business.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: business.status === 'open' ? colors.green500 : colors.red,
              marginRight: halfPadding,
              marginTop: halfPadding,
              bottom: 2,
            }}
          />
          <Text style={{ ...texts.x2s, color: colors.green600 }}>{businessStatus}</Text>
        </View>
      </View>
    </View>
  );
};
