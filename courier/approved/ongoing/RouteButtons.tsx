import { Order, WithId } from '@appjusto/types';
import React from 'react';
import { Image, Linking, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { borders, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { getNavigationLinkTo, NavigationApp } from './navigation';

interface Props {
  order: WithId<Order>;
}

export const RouteButtons = ({ order }: Props) => {
  // helpers
  const tallerDevice = useTallerDevice();
  const { dispatchingState } = order;
  // handler
  const routeHandler = (app: NavigationApp) => {
    let location = undefined;
    if (dispatchingState === 'going-pickup') {
      location = order.origin?.location;
    } else if (dispatchingState === 'arrived-pickup' || dispatchingState === 'going-destination') {
      location = order.destination?.location;
    }
    Linking.openURL(getNavigationLinkTo(app, location));
  };
  return dispatchingState && dispatchingState !== 'arrived-destination' ? (
    <PaddedView
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
      }}
    >
      <TouchableOpacity
        style={{
          ...borders.default,
          flexDirection: 'row',
          paddingHorizontal: tallerDevice ? 20 : padding,
          paddingVertical: halfPadding,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 2,
        }}
        onPress={() => routeHandler('waze')}
      >
        <Image source={icons.waze} height={24} width={24} />
        <Text style={{ ...texts.xs, paddingLeft: halfPadding }}>{t('Abrir no Waze')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...borders.default,
          flexDirection: 'row',
          paddingHorizontal: tallerDevice ? 20 : padding,
          paddingVertical: halfPadding,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 2,
        }}
        onPress={() => routeHandler('google-maps')}
      >
        <Image source={icons.googleMaps} height={24} width={24} />
        <Text style={{ ...texts.xs, paddingLeft: halfPadding }}>{t('Abrir no Maps')}</Text>
      </TouchableOpacity>
    </PaddedView>
  ) : null;
};
