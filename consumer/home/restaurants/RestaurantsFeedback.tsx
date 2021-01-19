import React from 'react';
import { View } from 'react-native';
import * as icons from '../../../assets/icons';
import FeedbackView from '../../../common/components/views/FeedbackView';
import HomeShareCard from '../../../common/screens/home/cards/HomeShareCard';
import { t } from '../../../strings';

export default function () {
  return (
    <FeedbackView
      header={t('Sem restaurantes na sua região')}
      description={t(
        'Infelizmente não encontramos nenhum restaurante cadastrado no app próximo a você. Estamos começando, mas não se preocupe: em breve seu restaurante preferido estará aqui.'
      )}
      icon={icons.coneYellow}
    >
      <View style={{ marginTop: 32 }}>
        <HomeShareCard
          isGrey
          title={t('Divulgue o AppJusto')}
          subtitle={t(
            'Assim mais clientes, entregadores, e restaurantes, podem fazer parte de entregas mais justas.'
          )}
        />
      </View>
    </FeedbackView>
  );
}
