import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import { borders, colors, doublePadding, halfPadding, padding, texts } from '../../common/styles';
import { OrdersKanbanListItem } from './OrdersKanbanListItem';

type Props = {
  title: string;
  orders?: WithId<Order>[];
  details?: string;
};

export const OrdersKanbanCard = ({ title, orders, details }: Props) => {
  return (
    <View style={{ ...borders.default, flex: 1, width: '100%', minHeight: 360 }}>
      <View
        style={{
          paddingHorizontal: padding,
          paddingVertical: halfPadding,
          flexDirection: 'row',
          backgroundColor: colors.grey50,
          height: 48,
          alignItems: 'center',
          // alignItems: orders.length > 0 ? 'flex-start' : 'center',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderBottomColor: colors.grey500,
        }}
      >
        <View
          style={{
            height: 32,
            width: 32,
            borderRadius: 16,
            backgroundColor: colors.white,
            // backgroundColor: orders.length > 0 ? colors.green100 : colors.white,
            marginRight: padding,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <Text style={{...texts.lg}}>{orders.length}</Text> */}
          <Text style={{ ...texts.lg }}>0</Text>
        </View>
        <Text style={{ ...texts.lg }}>{title}</Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          justifyContent: 'flex-start',
          // justifyContent: orders.length > 0 ? 'flex-start' : 'center',
          alignItems: 'center',
          paddingHorizontal: padding,
          paddingVertical: doublePadding,
        }}
      >
        {/* <ShowIf
          // test={orders.length === 0 && Boolean(details)}
          test={Boolean(details)}
        >
          {() => (
            <Text style={{ textAlign: 'center', ...texts.sm, color: colors.grey700 }}>
              {details}
            </Text>
          )}
        </ShowIf> */}
        <OrdersKanbanListItem />
        {/* <ShowIf test={orders?.length > 0}>
          {orders?.map((order) => (
            <OrdersKanbanListItem />
          ))}
        </ShowIf> */}
      </View>
    </View>
  );
};
