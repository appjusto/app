import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import PaddedView from '../../common/components/containers/PaddedView';
import HomeShareCard from '../../common/screens/home/cards/HomeShareCard';
import { screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'AboutBeAvailable'>;

export const AboutBeAvailable = () => {
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView>
        <Text style={{ ...texts.x2l }}>
          {t('Você é importante para esse movimento dar certo. Divulgue para outros entregadores!')}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Quanto mais consumidores satisfeitos, mais pedidos. Se os entregadores aceitarem sempre os pedidos que tocarem pelo AppJusto, mais força terá a rede.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 24 }}>
          {t(
            'Contamos com a sua ajuda para difundir esse movimento. Comece a divulgar o AppJusto para outros entregadores agora mesmo!'
          )}
        </Text>
        <View style={{ flex: 1 }} />
        <View>
          <HomeShareCard
            title="Divulgue o AppJusto"
            subtitle="Clique para compartilhar esse movimento nas suas redes"
          />
        </View>
      </PaddedView>
    </ScrollView>
  );
};
