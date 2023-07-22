import { Order, WithId } from '@appjusto/types';
import { Ionicons } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import HR from '../../../../common/components/views/HR';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
import OrderMap from '../../../../common/screens/orders/OrderMap';
import { OrderAdditionalInfo } from '../../../../common/screens/orders/summary/OrderAdditionaInfo';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { Step } from '../../p2p/types';
import { OrderItems } from './OrderItems';
import { OrderPlacesSummary } from './OrderPlacesSummary';
import { OrderScheduling } from './OrderScheduling';

type Props = {
  order: WithId<Order>;
  showMap: boolean;
  onEditStep: (step: Step) => void;
  onEditItemPress?: (productId: string, itemId: string) => void;
  onAddItemsPress?: () => void;
  additionalInfo?: string;
  onAddInfo?: (text: string) => void;
  shareDataWithBusiness?: boolean;
  onShareData?: (value: boolean) => void;
  orderFulfillment: React.ReactNode;
  costBreakdown: React.ReactNode;
  totalCost: React.ReactNode;
  payment: React.ReactNode;
  onCheckSchedules?: () => void;
};

export const OrderSummary = ({
  order,
  showMap,
  onEditStep,
  onEditItemPress,
  onAddItemsPress,
  additionalInfo,
  onAddInfo,
  shareDataWithBusiness,
  onShareData,
  orderFulfillment: availableFleets,
  costBreakdown,
  totalCost,
  payment,
  onCheckSchedules,
}: Props) => {
  // context
  const tallerDevice = useTallerDevice();
  const { route, type, fulfillment } = order;

  // UI
  return (
    <ScrollView
      style={{ flex: 1, paddingBottom: 24 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {showMap ? (
        <View style={{ height: 160 }}>
          <OrderMap
            originLocation={order.origin?.location}
            destinationLocation={order.destination?.location}
            route={fulfillment === 'delivery' ? route : undefined}
            ratio={360 / 160}
          />
        </View>
      ) : null}
      <View style={{ marginTop: padding }}>
        <OrderPlacesSummary order={order} onEditStep={onEditStep} />
        {type === 'food' ? <OrderScheduling onCheckSchedules={onCheckSchedules} /> : null}
      </View>

      {!isEmpty(order.items) ? (
        <View>
          <HR height={padding} />
          <OrderItems
            order={order}
            onEditItemPress={onEditItemPress!}
            onAddItemsPress={onAddItemsPress!}
          />
          <OrderAdditionalInfo value={additionalInfo!} onAddInfo={onAddInfo!} />
        </View>
      ) : null}
      {type === 'food' ? (
        <View style={{ flex: 1, marginHorizontal: padding, marginBottom: padding }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
            <Ionicons name="share-social-outline" size={16} style={{ marginRight: 4 }} />
            <Text style={{ ...texts.sm, color: colors.black }}>
              {t('Compartilhar dados com o restaurante')}
            </Text>
          </View>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t(
              'Aceito compartilhar meu nome, e-mail e telefone para eventuais promoções desse restaurante'
            )}
          </Text>
          <View style={{ marginTop: halfPadding, flexDirection: 'row', alignItems: 'center' }}>
            <Switch
              trackColor={{ false: colors.grey500, true: colors.grey500 }}
              thumbColor={shareDataWithBusiness ? colors.green500 : colors.yellow}
              ios_backgroundColor={colors.white}
              onValueChange={onShareData}
              value={shareDataWithBusiness}
            />
            <Text style={{ ...texts.sm, marginLeft: padding }}>{t('Compartilhar dados')}</Text>
          </View>
        </View>
      ) : null}

      <HR height={padding} />

      {availableFleets}

      <HR height={padding} />

      {costBreakdown}

      <HR height={padding} />

      {totalCost}

      <HR height={padding} />

      {payment}
    </ScrollView>
  );
};
