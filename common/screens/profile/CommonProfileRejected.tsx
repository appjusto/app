import React from 'react';
import { Linking, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import { ApiContext, AppDispatch } from '../../app/context';
import DefaultButton from '../../components/buttons/DefaultButton';
import FeedbackView from '../../components/views/FeedbackView';
import { IconConeYellow } from '../../icons/icon-cone-yellow';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';
import { padding } from '../../styles';

export const CommonProfileRejected = () => {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // app state
  // TODO: put this user logic into a hook
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const profile = flavor === 'consumer' ? consumer! : courier!;
  // state
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('CommonProfileRejected');
  return (
    <FeedbackView
      header={t('Seu cadastro foi recusado :(')}
      // description={courier.profileIssues?.join('\n') ?? t('Entre em contato com nosso suporte.')}
      description={t('Entre em contato com nosso suporte.')} // TODO: make this dynamic
      icon={<IconConeYellow />}
    >
      {profile === courier ? (
        <DefaultButton
          title={t('Editar cadastro')}
          onPress={() => null}
          secondary
          activityIndicator={isLoading}
          disabled={isLoading}
        />
      ) : (
        <View style={{ marginBottom: padding }}>
          <DeliveryProblemCard
            title={t('Falar com o AppJusto')}
            subtitle={t('Abrir chat no WhatsApp')}
            onPress={() => {
              track('opening whatsapp chat with backoffice');
              Linking.openURL(AppJustoAssistanceWhatsAppURL);
            }}
            situation="chat"
          />
        </View>
      )}
    </FeedbackView>
  );
};
