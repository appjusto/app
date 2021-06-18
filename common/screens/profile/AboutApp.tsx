import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import React, { useContext } from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileParamList } from '../../../consumer/v2/main/profile/types';
import { CourierProfileParamList } from '../../../courier/approved/main/profile/types';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import {
  AppJustoFreshdeskConsumerURL,
  AppJustoFreshdeskCourierURL,
  AppJustoGithubURL,
  AppJustoSiteURL,
} from '../../../strings/values';
import { ApiContext, AppDispatch } from '../../app/context';
import PaddedView from '../../components/containers/PaddedView';
import ConfigItem from '../../components/views/ConfigItem';
import { IconVersion } from '../../icons/icon-version';
import { getFlavor } from '../../store/config/selectors';
import { showToast } from '../../store/ui/actions';
import { screens } from '../../styles';
import HomeCard from '../home/cards/HomeCard';

export type AboutAppParamList = {
  AboutApp: undefined;
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & CourierProfileParamList & UnapprovedParamList,
  'AboutApp'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const AboutApp = ({ navigation }: Props) => {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const flavor = useSelector(getFlavor);
  // handlers
  const easterEggHandler = () => {
    api.search().clearCache();
    dispatch(showToast('Clearing algolia cache...'));
  };
  // UI
  const appVersion = `${t('Versão:')} ${Constants.nativeAppVersion} / ${
    Constants.manifest.version
  }`;
  const brand = Device.brand ?? Device.manufacturer ?? '';
  const model = Device.modelName ?? Device.modelId ?? Device.productName ?? '';
  const os = `${brand} ${model} ${Device.osVersion} ${
    Platform.OS === 'android' ? Device.platformApiLevel : ''
  }`;
  // handlers
  const freshDeskHandler = () => {
    Linking.openURL(
      flavor === 'courier' ? AppJustoFreshdeskCourierURL : AppJustoFreshdeskConsumerURL
    );
  };
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <ConfigItem
          title={t('Central de ajuda')}
          subtitle={t('Tire suas dúvidas')}
          onPress={freshDeskHandler}
        />
        <ConfigItem
          title={t('Site oficial')}
          subtitle={t('Acesse nosso site')}
          onPress={() => Linking.openURL(AppJustoSiteURL)}
        />
        <ConfigItem
          title={t('Código aberto')}
          subtitle={t('Acesse o repositório com o código no GitHub')}
          onPress={() => Linking.openURL(AppJustoGithubURL)}
        />
      </View>
      <View style={{ flex: 1 }} />
      <SafeAreaView>
        <PaddedView>
          <Pressable delayLongPress={2000} onLongPress={easterEggHandler}>
            <HomeCard icon={<IconVersion />} title={appVersion} subtitle={os} />
          </Pressable>
        </PaddedView>
      </SafeAreaView>
    </ScrollView>
  );
};
