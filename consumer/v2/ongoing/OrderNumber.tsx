import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import { useObserveBusiness } from '../../../common/store/api/business/hooks/useObserveBusiness';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  code?: string;
  businessId: string;
};

export const OrderNumber = ({ code, businessId }: Props) => {
  // context
  const business = useObserveBusiness(businessId);
  if (!business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="small" color={colors.green500} />
      </View>
    );
  }
  const { businessAddress } = business;
  return (
    <View style={{ backgroundColor: colors.white, paddingTop: halfPadding, flex: 1 }}>
      <SingleHeader title={t('Retirada')} />
      {business && businessAddress ? (
        <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
          <Text style={{ ...texts.sm }}>
            {businessAddress.address}, {businessAddress.number}
          </Text>
          <Text style={{ ...texts.sm }}>{businessAddress.neighborhood}</Text>
          {businessAddress.instructions ? (
            <Text style={{ ...texts.sm }}>{businessAddress.instructions}</Text>
          ) : null}
        </View>
      ) : null}
      <View style={{ paddingHorizontal: padding }}>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Apresente o número do pedido no momento da retirada no restaurante.')}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: padding,
          flex: 1,
        }}
      >
        <View
          style={{
            ...borders.default,
            backgroundColor: colors.white,
            borderColor: colors.black,
            borderWidth: 2,
            borderRadius: 32,
          }}
        />
        <Text style={{ ...texts.sm, marginLeft: halfPadding }}>{t('Número do pedido: ')}</Text>
        <Text style={{ ...texts.x4l, marginLeft: halfPadding }}>#{code ?? ''}</Text>
      </View>
      <View style={{ height: padding }} />
      <HR height={padding} />
    </View>
  );
};
