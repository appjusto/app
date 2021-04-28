import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileParamList } from '../../../consumer/v2/main/profile/types';
import { CourierProfileParamList } from '../../../courier/approved/main/profile/types';
import { t } from '../../../strings';
import PaddedView from '../../components/containers/PaddedView';
import ConfigItem from '../../components/views/ConfigItem';
import { screens } from '../../styles';
import VersionCard from '../home/cards/VersionCard';

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
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1 }}>
        <ConfigItem
          title={t('Central de ajuda')}
          subtitle={t('Tire suas dúvidas')}
          onPress={() => null}
        />
        <ConfigItem
          title={t('Site oficial')}
          subtitle={t('Acesse nosso site')}
          onPress={() => null}
        />
        <ConfigItem
          title={t('Código aberto')}
          subtitle={t('Acesse o repositório com o código no GitHub')}
          onPress={() => null}
        />
      </View>
      <View style={{ flex: 1 }} />
      <SafeAreaView>
        <PaddedView>
          <VersionCard
            title={t('Versão do aplicativo: {0000}')}
            subtitle={t('Atualizado em 00/00/0000')}
          />
        </PaddedView>
      </SafeAreaView>
    </ScrollView>
  );
};
