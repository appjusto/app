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
      if (dispatchingState === 'arrived-pickup') {
        buttonTitle = t('Entregar pedido');
        textColor = colors.black;
        background = colors.darkYellow;
      } else {
        buttonTitle = t('Pedido pronto');
        textColor = colors.white;
        background = colors.grey700;
      }
    }
  }
  if (variant === 'cancel') {
    buttonTitle = t('Cancelar pedido');
    textColor = colors.white;
    background = colors.red;
  }

  return (
    <TouchableOpacity disabled={disabled} {...props}>
      <View
        style={[
          {
            flexDirection: 'row',
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
