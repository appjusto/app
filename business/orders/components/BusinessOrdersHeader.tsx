import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useContextGetSeverTime } from '../../../common/contexts/ServerTimeContext';
import { useBusinessLogoURI } from '../../../common/store/api/business/hooks/useBusinessLogoURI';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { ListItemImage } from '../../../consumer/v2/food/common/ListItemImage';
import { t } from '../../../strings';
import { BusinessAppContext } from '../../BusinessAppContext';
import { businessShouldBeOpen } from '../helpers';

type Props = {
  onSwitchBusiness: () => void;
};

export const BusinessOrdersHeader = ({ onSwitchBusiness }: Props) => {
  // context
  const { businesses, business } = React.useContext(BusinessAppContext);
  const { data: logo } = useBusinessLogoURI(business?.id);
  const getServerTime = useContextGetSeverTime();
  if (!business) return null;
  // helpers
  const today = getServerTime();
  const shouldBeOpen = businessShouldBeOpen(today, business.schedules) && business.enabled === true;

  const businessStatus = shouldBeOpen ? t('RESTAURANTE ABERTO') : t('RESTAURANTE FECHADO');
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
        <ListItemImage uri={logo} height={48} width={48} radius={24} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '70%',
          }}
        >
          <View style={{ width: '100%' }}>
            <Text style={{ ...texts.lg }} numberOfLines={3}>
              {business.name}
            </Text>
          </View>
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
                backgroundColor: shouldBeOpen ? colors.green500 : colors.red,
                marginRight: halfPadding,
                marginTop: halfPadding,
                bottom: 4,
              }}
            />
            <Text style={{ ...texts.x2s, color: colors.green600 }}>{businessStatus}</Text>
          </View>
        </View>
        {businesses && businesses?.length > 1 ? (
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={onSwitchBusiness}>
              <Text style={{ ...texts.md, color: colors.green600 }}>{t('Trocar')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};
