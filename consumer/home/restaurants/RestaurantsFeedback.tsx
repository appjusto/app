import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import FeedbackView from '../../../common/components/views/FeedbackView';
import HomeShareCard from '../../../common/screens/home/cards/HomeShareCard';
import { screens } from '../../../common/styles';
import LocationBar from './components/LocationBar';

type Props = {
  address: string;
};

export default function ({ address }: Props) {
  return (
    <ScrollView style={{ ...screens.default }}>
      <PaddedView>
        <LocationBar address={address} />
      </PaddedView>
      <PaddedView style={{ ...screens.centered, marginTop: 32 }}>
        <FeedbackView
          header="Sem restaurantes na sua região"
          description="Infelizmente não encontramos nenhum restaurante cadastrado no app próximo a você. Estamos começando, mas não se preocupe: em breve seu restaurante preferido estará aqui."
          icon={icons.coneYellow}
        >
          <View style={{ marginTop: 32 }}>
            <HomeShareCard
              isGrey
              title="Divulgue o AppJusto"
              subtitle="Assim mais clientes, entregadores, e restaurantes, podem fazer parte de entregas mais justas."
            />
          </View>
        </FeedbackView>
      </PaddedView>
    </ScrollView>
  );
}
