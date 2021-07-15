import React from 'react';
import { View } from 'react-native';
import { Order, WithId } from '../../../../types';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { padding } from '../../../common/styles';
import { t } from '../../../strings';
import { StatusControl } from './StatusControl';

type Props = {
  order: WithId<Order>;
  text: string;
  onReceiveOrder: () => void;
  disabled: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  sliderColor: string;
};

export const OngoingDeliverySlider = ({
  order,
  text,
  onReceiveOrder,
  disabled,
  isLoading,
  onConfirm,
  sliderColor,
}: Props) => {
  const { dispatchingState, status, type } = order;
  if (!dispatchingState || dispatchingState === 'arrived-destination') return null;
  return (
    <View style={{ paddingHorizontal: padding }}>
      {(type === 'food' && dispatchingState === 'arrived-pickup' && status === 'ready') ||
      (type === 'food' && dispatchingState !== 'going-destination' && status === 'dispatching') ? (
        <View style={{ paddingVertical: padding }}>
          <DefaultButton
            title={t('Receber pedido')}
            onPress={onReceiveOrder}
            activityIndicator={isLoading}
          />
        </View>
      ) : (
        <StatusControl
          key={dispatchingState}
          style={{ marginBottom: padding }}
          text={text}
          disabled={disabled}
          isLoading={isLoading}
          onConfirm={onConfirm}
          color={sliderColor}
        />
      )}
    </View>
  );
};
