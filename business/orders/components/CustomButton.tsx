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
}

export const CustomButton = ({ order, disabled, style, activityIndicator, ...props }: Props) => {
  const { status, dispatchingState } = order;

  let textColor;
  let background;
  let buttonTitle;
  if (status === 'confirmed') {
    textColor = colors.black;
    background = colors.green500;
    buttonTitle = t('Aceitar pedido');
  }
  if (status === 'preparing') {
    textColor = colors.black;
    background = colors.green500;
    buttonTitle = t('Finalizar preparo');
  }
  if (status === 'ready') {
    buttonTitle = t('Entregar pedido');
    if (dispatchingState === 'arrived-pickup') {
      textColor = colors.black;
      background = colors.darkYellow;
    } else {
      textColor = colors.white;
      background = colors.grey700;
    }
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
