import { Business, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useBusinessLogoURI } from '../../../common/store/api/business/hooks/useBusinessLogoURI';
import { borders, colors, padding, texts } from '../../../common/styles';
import { ListItemImage } from '../../../consumer/v2/food/common/ListItemImage';

type Props = {
  business: WithId<Business>;
  selected: boolean;
  onSelectBusiness: () => void;
};

export const SelectBusinessCard = ({ business, selected, onSelectBusiness }: Props) => {
  // context
  const { data: logo } = useBusinessLogoURI(business.id);
  // UI
  return (
    <TouchableOpacity onPress={onSelectBusiness}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding,
          height: 96,
          backgroundColor: selected ? colors.white : colors.grey50,
          ...borders.default,
          borderColor: selected ? colors.white : colors.grey700,
        }}
      >
        <View style={{ width: '63%' }}>
          <Text style={{ ...texts.sm }}>{business.name ?? ''}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700, marginTop: 4 }}>
            {business.businessAddress?.address ?? ''}, {business.businessAddress?.number ?? ''}
          </Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {business.businessAddress?.neighborhood ?? ''}
          </Text>
        </View>
        <View style={{ width: '25%', alignItems: 'flex-end' }}>
          <ListItemImage uri={logo} height={64} width={64} radius={32} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
