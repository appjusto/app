import { Order, WithId } from '@appjusto/types';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends TouchableOpacityProps, ViewProps {
  order: WithId<Order>;
  activityIndicator?: boolean;
  variant?: 'changing' | 'cancel';
}

export const CustomButton = ({
  order,
  disabled,
  style,
  activityIndicator,
  variant = 'changing',
  ...props
}: Props) => {
  const { status, dispatchingState, dispatchingStatus } = order;

  let textColor;
  let background;
  let buttonTitle;
  let buttonDisabled = disabled;
  if (variant === 'changing') {
    if (status === 'confirmed') {
      textColor = colors.black;
      background = colors.green500;
      buttonTitle = t('Aceitar pedido');
    }
    if (status === 'preparing') {
      textColor = colors.black;
      background = colors.green500;
      buttonTitle = t('Pedido pronto');
    }
    if (status === 'ready') {
      if (
        order.fulfillment !== 'delivery' ||
        order.fare?.courier?.payee === 'business' ||
        dispatchingStatus === 'outsourced' ||
        dispatchingState === 'arrived-pickup'
      ) {
        buttonTitle =
          order.fulfillment === 'take-away' ? t('Entregar pedido') : t('Despachar pedido');
        textColor = colors.black;
        background = colors.darkYellow;
      } else {
        buttonDisabled = true;
        textColor = colors.white;
        background = colors.grey700;
      }
    } else if (status === 'dispatching') {
      if (order.fare?.courier?.payee === 'business') {
        buttonTitle = t('Entregar pedido');
        textColor = colors.black;
        background = colors.darkYellow;
      }
    }
  } else if (variant === 'cancel') {
    buttonTitle = t('Cancelar pedido');
    textColor = colors.white;
    background = colors.red;
  }
  if (!buttonTitle) return null;

  return (
    <TouchableOpacity disabled={buttonDisabled} {...props}>
      <View
        style={[
          {
            ...borders.default,
            paddingHorizontal: padding,
            paddingVertical: 14,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: background,
            borderColor: background,
          },
          style,
        ]}
      >
        {!activityIndicator ? (
          <Text style={{ ...texts.sm, color: textColor }}>{buttonTitle}</Text>
        ) : (
          <ActivityIndicator size="small" color={colors.black} />
        )}
      </View>
    </TouchableOpacity>
  );
};
