import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../common/styles';

type Props = {
  order?: WithId<Order>;
  navigateToOrderDetail?: () => void;
};

export const OrdersKanbanListItem = ({ order, navigateToOrderDetail }: Props) => {
  // state
  // const [elapsedTime, setElapsedTime] = React.useState<number | null>(0);
  return (
    <TouchableOpacity onPress={navigateToOrderDetail} style={{ height: 54, width: '100%' }}>
      <View
        style={{
          backgroundColor: colors.green100,
          paddingHorizontal: padding,
          paddingVertical: halfPadding,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...borders.default,
          borderWidth: 2,
          borderColor: colors.black,
        }}
      >
        <View>
          {/* <Text style={{...texts.xs}}>{order.consumer.name}</Text> */}
          <Text style={{ ...texts.xs }}>Daniel</Text>
          {/* <Text style={[texts.bold, texts.lg]}>#{order.code}</Text> */}
          <Text style={[texts.bold, texts.lg]}>#0001</Text>
        </View>
        <View>
          {/* <Text style={{ ...texts.sm }}>{elapsedTime}</Text> */}
          <Text style={{ ...texts.sm }}>10 min. atrás</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
