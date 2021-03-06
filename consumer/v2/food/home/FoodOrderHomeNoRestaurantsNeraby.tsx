import React from 'react';
import { View } from 'react-native';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../../common/icons/icon-cone-yellow';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { t } from '../../../../strings';

export default function () {
  return (
    <FeedbackView
      header={t('Sem restaurantes na sua região')}
      description={t(
        'Infelizmente não encontramos nenhum restaurante cadastrado no app próximo a você. Estamos começando, mas não se preocupe: em breve seu restaurante preferido estará aqui.'
      )}
      icon={<IconConeYellow />}
    >
      <View style={{ marginTop: 32 }}>
        <HomeShareCard
          isGrey
          title={t('Divulgue o AppJusto')}
          subtitle={t(
            'Assim mais clientes, entregadores/as, e restaurantes, podem fazer parte de entregas mais justas.'
          )}
        />
      </View>
    </FeedbackView>
  );
}
