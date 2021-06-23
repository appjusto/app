import React from 'react';
import { Image, Text, View } from 'react-native';
import { Order, WithId } from '../../../../types';
import { pinPackage, pinPackageWhite } from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import { CourierDistanceBadge } from '../../../common/screens/orders/ongoing/CourierDistanceBadge';
import { courierNextPlace } from '../../../common/store/api/order/helpers';
import { colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
};

export const OngoingDeliveryInfo = ({ order }: Props) => {
  const { dispatchingState } = order;
  const nextPlace = courierNextPlace(order);
  const addressLabel = (() => {
    if (!dispatchingState || dispatchingState === 'going-pickup') {
      return t('Retirada');
    } else if (
      dispatchingState === 'arrived-pickup' ||
      dispatchingState === 'arrived-destination' ||
      dispatchingState === 'going-destination'
    ) {
      return t('Entrega');
    }
    return '';
  })();
  return (
    <PaddedView>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={dispatchingState === 'going-pickup' ? pinPackageWhite : pinPackage}
          style={{ width: 23, height: 28 }}
        />
        <Text
          style={[
            texts.xs,
            texts.bold,
            { marginVertical: halfPadding, marginHorizontal: halfPadding },
          ]}
        >
          {addressLabel}
        </Text>
        <CourierDistanceBadge order={order} delivering />
      </View>
      <View style={{ marginTop: halfPadding }}>
        <Text style={[texts.xl]} numberOfLines={2}>
          {nextPlace?.address.main}
        </Text>
        <Text style={[texts.xl]} numberOfLines={2}>
          {nextPlace?.address.secondary}
        </Text>
        <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]}>
          {nextPlace?.additionalInfo ?? ''}
        </Text>
        <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]} numberOfLines={2}>
          {nextPlace?.intructions ?? ''}
        </Text>
      </View>
    </PaddedView>
  );
};
