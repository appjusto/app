import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { t } from '../../../strings';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'Layout'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'Layout'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const Layout = () => {
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
        <View style={{ marginTop: 24, width: '100%', height: 64, flexDirection: 'row' }}>
          <View>
            <Text style={{ ...texts.md, color: colors.grey700 }}>{t('Você recebe')}</Text>
            <Text style={{ ...texts.x4l }}>R$ 12,50</Text>
          </View>
          <View>
            <Text style={{ ...texts.md, color: colors.grey700 }}>{t('Você recebe')}</Text>
            <Text style={{ ...texts.x4l }}>R$ 12,50</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
