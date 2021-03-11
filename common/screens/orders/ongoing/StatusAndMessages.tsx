import { DispatchingState } from 'appjusto-types';
import React from 'react';
import { View } from 'react-native';
import { padding } from '../../../styles';
import { MessagesCard } from '../../home/cards/MessagesCard';
import CourierStatusHighlight from './CourierStatusHighlight';

type Props = {
  dispatchingState: DispatchingState;
  orderId: string;
  onMessageReceived: () => void;
};

export const StatusAndMessages = ({
  dispatchingState,
  orderId,
  onMessageReceived,
  ...props
}: Props) => {
  return (
    <View {...props}>
      <CourierStatusHighlight dispatchingState={dispatchingState} />
      <View
        style={{
          width: '100%',
          top: -176,
          alignSelf: 'center',
          paddingHorizontal: padding,
        }}
      >
        <MessagesCard orderId={orderId} onPress={onMessageReceived} />
      </View>
    </View>
  );
};
