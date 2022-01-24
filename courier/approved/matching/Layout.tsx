import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { t } from '../../../strings';
import { AcceptControl } from './AcceptControl';
import { AddressCard } from './AddressCard';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'Layout'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'Layout'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const Layout = () => {
  //helpers
  const tallerDevice = useTallerDevice();
  // tracking
  useSegmentScreen('Matching');
  return (
    <ScrollView
      style={[screens.default]}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ paddingHorizontal: padding, paddingVertical: 24, flex: 1 }}>
        <View
          style={{
            width: '100%',
            height: 54,
            backgroundColor: colors.green50,
            borderRadius: 64,
            padding,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ marginRight: halfPadding, ...texts.md }}>
            {String.fromCodePoint(0x1f389)}
          </Text>
          <Text style={{ ...texts.md, color: colors.grey700 }}>{t('Nova corrida disponível')}</Text>
        </View>
        <View
          style={{
            marginTop: 24,
            width: '100%',
            height: 64,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ ...texts.md, color: colors.grey700, textAlign: 'center' }}>
              {t('Você recebe')}
            </Text>
            <Text style={{ ...texts.x4l, textAlign: 'center' }}>R$ 12,50</Text>
          </View>
          <View
            style={{
              height: '100%',
              borderLeftColor: colors.grey500,
              borderLeftWidth: 1,
              borderStyle: 'solid',
            }}
          />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ ...texts.md, color: colors.grey700, textAlign: 'center' }}>
              {t('Retirada em')}
            </Text>
            <Text style={{ ...texts.x4l, textAlign: 'center' }}>3.4 KM</Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        {/* cards origin and destination */}
        <View style={{ marginBottom: halfPadding }}>
          <AddressCard kind="origin" />
        </View>
        <View>
          <AddressCard kind="destination" />
        </View>
        <View style={{ flex: 1 }} />
        {/* slider */}
        <View>
          <AcceptControl
            onAccept={() => null}
            onReject={() => null}
            style={{
              marginBottom: tallerDevice ? padding * 4 : padding,
              paddingHorizontal: padding,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};
