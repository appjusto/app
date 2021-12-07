import { Order, WithId } from '@appjusto/types';
import { t } from 'i18n-js';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import * as icons from '../../../assets/icons';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { getNavigationLinkTo, NavigationApp } from './navigation';

interface Props {
  order: WithId<Order>;
}

export const RouteIcons = ({ order }: Props) => {
  const routeHandler = (app: NavigationApp) => {
    const dispatchingState = order?.dispatchingState;
    let location = undefined;
    if (dispatchingState === 'going-pickup') {
      location = order.origin?.location;
    } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'going-destination') {
      location = order.destination?.location;
    }
    Linking.openURL(getNavigationLinkTo(app, location));
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        position: 'absolute',
        top: halfPadding,
        right: padding,
        left: padding,
      }}
    >
      <TouchableOpacity onPress={() => routeHandler('google-maps')}>
        <View
          style={{
            height: 40,
            // width: 64,
            ...borders.default,
            // borderRadius: 32,
            borderColor: colors.black,
            // borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: colors.grey500,
            paddingHorizontal: padding,
          }}
        >
          <Image source={icons.googleMaps} height={24} width={24} />
          <Text style={{ ...texts.xs, marginLeft: halfPadding }}>{t('Abrir no Maps')}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => routeHandler('waze')}>
        <View
          style={{
            height: 40,
            // width: 64,
            ...borders.default,
            // borderRadius: 32,
            borderColor: colors.black,
            // borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: halfPadding,
            // backgroundColor: colors.grey500,
            paddingHorizontal: padding,
          }}
        >
          <Image source={icons.waze} height={24} width={24} />
          <Text style={{ ...texts.xs, marginLeft: halfPadding }}>{t('Abrir no Waze')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
