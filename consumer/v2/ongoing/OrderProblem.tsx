import React from 'react';
import { ScrollView } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { screens } from '../../../common/styles';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { t } from '../../../strings';

export const OrderProblem = () => {
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        {/* goes to a screen with a ReportIssueView */}
        <DeliveryProblemCard
          title={t('Problema com o pedido')}
          subtitle={t('Informe o seu problema')}
          onPress={() => null}
          situation="consumer-problem"
        />
        {/* open whatsapp chat */}
        <DeliveryProblemCard
          title={t('Preciso falar com o AppJusto')}
          subtitle={t('Abrir chat no WhatsApp')}
          onPress={() => null}
          situation="chat"
        />
        {/* commented for now. will be added back later when we have this feature */}
        {/* <DeliveryProblemCard
          title={t('Estou com o problema urgente')}
          subtitle={t('O AppJusto vai ligar para você')}
          onPress={() => null}
          situation="urgent"
        /> */}
      </PaddedView>
    </ScrollView>
  );
};
