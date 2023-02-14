import { Fare, LedgerEntry, Order, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { getOrderTotal } from '../../../../common/store/api/order/helpers';
import { getFlavor } from '../../../../common/store/config/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import IzaIcon from './iza';
import { OrderCostModal } from './OrderCostModal';

type Props = {
  order: WithId<Order>;
  selectedFare: Fare | undefined;
  hideItems?: boolean;
  ledgerEntry?: LedgerEntry | null;
};

export const OrderCostBreakdown = ({ order, selectedFare, hideItems, ledgerEntry }: Props) => {
  // redux
  const flavor = useSelector(getFlavor);
  // state
  const [modalVisible, setModalVisible] = React.useState(false);
  // UI
  return (
    <View style={{ flex: 1 }}>
      <OrderCostModal
        fare={selectedFare}
        visible={modalVisible}
        setModalVisible={(value) => setModalVisible(value)}
      />
      <SingleHeader title={t('Entenda os valores')} />
      <View style={{ paddingTop: halfPadding, paddingBottom: padding, paddingHorizontal: padding }}>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Somos transparentes do início ao fim da entrega')}
        </Text>
        <View>
          {flavor === 'consumer' && !isEmpty(order.items) && !hideItems ? (
            <View
              style={{
                marginTop: halfPadding,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ ...texts.sm }}>{t('Itens do pedido')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(getOrderTotal(order))}</Text>
            </View>
          ) : null}
          {flavor === 'consumer' && selectedFare?.platform?.value ? (
            <View
              style={{
                marginTop: halfPadding,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ ...texts.sm }}>{t('AppJusto')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.platform.value)}</Text>
            </View>
          ) : null}
          {flavor === 'courier' && selectedFare?.courier?.netValue ? (
            <View
              style={{
                marginTop: halfPadding,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ ...texts.sm }}>{t('Entrega')}</Text>
              <Text style={{ ...texts.sm }}>{formatCurrency(selectedFare.courier.netValue)}</Text>
            </View>
          ) : null}
          {flavor === 'courier' && selectedFare?.courier?.locationFee ? (
            <View
              style={{
                marginTop: halfPadding,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ ...texts.sm }}>{t('Taxa de alta demanda')}</Text>
              <Text style={{ ...texts.sm }}>
                {formatCurrency(selectedFare.courier.locationFee)}
              </Text>
            </View>
          ) : null}
          {flavor === 'consumer' && selectedFare?.courier?.netValue ? (
            <View
              style={{
                marginTop: halfPadding,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...texts.sm }}>{t('Entrega')}</Text>
                {selectedFare?.courier?.locationFee ? (
                  <View
                    style={{
                      marginLeft: padding,
                      ...borders.rounder,
                      backgroundColor: colors.darkYellow,
                      padding: 4,
                      paddingHorizontal: halfPadding,
                    }}
                  >
                    <Text>Alta demanda</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ ...texts.sm }}>
                {formatCurrency(
                  selectedFare.courier.netValue + (selectedFare?.courier?.locationFee ?? 0)
                )}
              </Text>
            </View>
          ) : null}
          {flavor === 'consumer' && selectedFare?.courier?.processing?.value ? (
            <View
              style={{
                marginTop: halfPadding,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...texts.sm }}>
                  {t('Taxas')}
                  {selectedFare?.courier?.insurance ? t(' + Seguro') : ''}
                </Text>

                {selectedFare?.courier?.insurance ? (
                  <View style={{ marginLeft: padding }}>
                    <IzaIcon />
                  </View>
                ) : null}
              </View>
              <Text style={{ ...texts.sm }}>
                {formatCurrency(selectedFare.courier.processing?.value)}
              </Text>
            </View>
          ) : null}
          {order.tip?.value && (flavor === 'consumer' || order.tip?.status === 'paid') ? (
            <View
              style={{
                marginTop: halfPadding,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ ...texts.sm }}>{t('Caixinha')}</Text>
              <Text style={{ ...texts.sm }}>
                {formatCurrency(
                  order.tip.value - (flavor === 'courier' ? order.tip.processing?.value ?? 0 : 0)
                )}
              </Text>
            </View>
          ) : null}
          {ledgerEntry && flavor === 'courier' ? (
            <View style={{ marginTop: halfPadding }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...texts.sm }}>{t('Extra *')}</Text>
                <Text style={{ ...texts.sm }}>{formatCurrency(ledgerEntry.value)}</Text>
              </View>
              {ledgerEntry.description ? (
                <Text style={{ ...texts.xs, color: colors.black, marginTop: padding }}>
                  * {ledgerEntry.description}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
        {flavor === 'consumer' && selectedFare?.courier?.value ? (
          <View style={{ marginTop: padding }}>
            <DefaultButton
              style={{ paddingVertical: halfPadding }}
              title="Entenda nossas taxas"
              variant="secondary"
              icon={<Feather name="info" size={16} style={{ marginLeft: halfPadding }} />}
              onPress={() => setModalVisible(true)}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};
