import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import React from 'react';
import { Linking, Platform, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileParamList } from '../../../consumer/v2/main/profile/types';
import { CourierProfileParamList } from '../../../courier/approved/main/profile/types';
import { t } from '../../../strings';
import PaddedView from '../../components/containers/PaddedView';
import ConfigItem from '../../components/views/ConfigItem';
import { IconVersion } from '../../icons/icon-version';
import { screens } from '../../styles';
import HomeCard from '../home/cards/HomeCard';

export type AboutAppParamList = {
  AboutApp: undefined;
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & CourierProfileParamList,
  'AboutApp'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const AboutApp = ({ navigation }: Props) => {
  const appVersion = `${t('Versão:')} ${Constants.nativeAppVersion} / ${
    Constants.nativeBuildVersion
  }`;
  const brand = Device.brand ?? Device.manufacturer ?? '';
  const model = Device.modelName ?? Device.modelId ?? Device.productName ?? '';
  const os = `${brand} ${model} ${Device.osVersion} ${
    Platform.OS === 'android' ? Device.platformApiLevel : ''
  }`;
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <ConfigItem
          title={t('Central de ajuda')}
          subtitle={t('Tire suas dúvidas')}
          onPress={() => Linking.openURL('https://appjusto.freshdesk.com/')}
        />
        <ConfigItem
          title={t('Site oficial')}
          subtitle={t('Acesse nosso site')}
          onPress={() => Linking.openURL('https://appjusto.com.br/')}
        />
        <ConfigItem
          title={t('Código aberto')}
          subtitle={t('Acesse o repositório com o código no GitHub')}
          onPress={() => Linking.openURL('https://github.com/appjusto')}
        />
      </View>
      <View style={{ flex: 1 }} />
      <SafeAreaView>
        <PaddedView>
          <HomeCard icon={<IconVersion />} title={appVersion} subtitle={os} />
        </PaddedView>
      </SafeAreaView>
    </ScrollView>
  );
};
