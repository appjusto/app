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
  const { status, dispatchingState } = order;

  let textColor;
  let background;
  let buttonTitle;
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
      if (order.fulfillment === 'take-away') {
        buttonTitle = t('Entregar pedido');
        textColor = colors.black;
        background = colors.darkYellow;
      } else {
        buttonTitle = t('Despachar pedido');
        if (dispatchingState === 'arrived-pickup') {
          textColor = colors.black;
          background = colors.darkYellow;
        } else {
          textColor = colors.white;
          background = colors.grey700;
        }
      }
    } else if (status === 'dispatching') {
      if (order.fare?.courier?.payee === 'business') {
        buttonTitle = t('Entregar pedido');
        textColor = colors.black;
        background = colors.darkYellow;
      }
    }
  }
  if (variant === 'cancel') {
    buttonTitle = t('Cancelar pedido');
    textColor = colors.white;
    background = colors.red;
  }
  if (!buttonTitle) return null;

  return (
    <TouchableOpacity disabled={disabled} {...props}>
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
