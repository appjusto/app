import { Order, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { pinPackage, pinPackageWhite } from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { CourierDistanceBadge } from '../../../common/screens/orders/ongoing/CourierDistanceBadge';
import { courierNextPlace } from '../../../common/store/api/order/helpers';
import { colors, halfPadding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
  onProblem: () => void;
};

export const OngoingDeliveryInfo = ({ order, onProblem }: Props) => {
  const { dispatchingState, type } = order;
  const nextPlace = courierNextPlace(order);
  const tallerDevice = useTallerDevice();
  const addressLabel = (() => {
    if (
      !dispatchingState ||
      dispatchingState === 'going-pickup' ||
      dispatchingState === 'arrived-pickup'
    ) {
      return t('Retirada');
    } else if (
      dispatchingState === 'arrived-destination' ||
      dispatchingState === 'going-destination'
    ) {
      return t('Entrega');
    }
    return '';
  })();
  if (!dispatchingState) return null;
  return (
    <PaddedView style={{ flex: 1 }}>
      {tallerDevice ? (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
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
          {type === 'food' && dispatchingState === 'going-pickup' ? (
            <View>
              <TouchableOpacity onPress={onProblem}>
                <RoundedText
                  color={colors.red}
                  leftIcon={
                    <Feather name="info" size={12} color={colors.red} style={{ marginRight: 4 }} />
                  }
                >
                  {t('Tive um problema')}
                </RoundedText>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={{ alignItems: 'flex-start', justifyContent: 'space-between', flex: 1 }}>
          {type === 'food' && dispatchingState === 'going-pickup' ? (
            <View style={{ marginBottom: halfPadding }}>
              <TouchableOpacity onPress={onProblem}>
                <RoundedText
                  color={colors.red}
                  leftIcon={
                    <Feather name="info" size={12} color={colors.red} style={{ marginRight: 4 }} />
                  }
                >
                  {t('Tive um problema')}
                </RoundedText>
              </TouchableOpacity>
            </View>
          ) : null}
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
        </View>
      )}
      {order.type === 'p2p' ? (
        <View style={{ marginTop: halfPadding }}>
          <Text style={[texts.xl]} numberOfLines={2}>
            {nextPlace?.address.description.split('-')[0]}
          </Text>
          <Text style={[texts.xl]} numberOfLines={2}>
            {nextPlace?.address.secondary}
          </Text>
          {nextPlace?.additionalInfo ? (
            <View>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]}>
                {nextPlace?.additionalInfo ?? ''}
              </Text>
            </View>
          ) : null}
          {nextPlace?.intructions ? (
            <View>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]} numberOfLines={2}>
                {nextPlace?.intructions ?? ''}
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={{ marginTop: halfPadding }}>
          {dispatchingState === 'going-pickup' || dispatchingState === 'arrived-pickup' ? (
            <Text style={[texts.md, { color: colors.grey700 }]} numberOfLines={2}>
              {order.business!.name}
            </Text>
          ) : null}

          <Text style={[texts.xl]} numberOfLines={2}>
            {nextPlace?.address.description.split('-')[0]}
          </Text>
          <Text style={[texts.xl]} numberOfLines={2}>
            {nextPlace?.address.secondary}
          </Text>
          {nextPlace?.additionalInfo ? (
            <View>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]}>
                {nextPlace?.additionalInfo ?? ''}
              </Text>
            </View>
          ) : null}
          {nextPlace?.intructions ? (
            <View>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]} numberOfLines={2}>
                {nextPlace?.intructions ?? ''}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </PaddedView>
  );
};
