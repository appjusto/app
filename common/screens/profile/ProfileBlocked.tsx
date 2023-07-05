import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ProfileIssuesParamsList } from '../../../courier/ProfileIssuesNavigator';
import { BlockProcessContent } from '../../../courier/approved/main/howitworks/blocks/BlockProcessContent';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { SituationHeader } from '../../../courier/common/situation-header/SituationHeader';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import PaddedView from '../../components/containers/PaddedView';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';
import { screens } from '../../styles';

type ScreenNavigationProp = StackNavigationProp<
  UnapprovedParamList & ProfileIssuesParamsList,
  'ProfileBlocked'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // redux
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const flavor = useSelector(getFlavor);
  const profile = flavor === 'consumer' ? consumer! : courier!;
  // side effects
  // tracking
  useSegmentScreen('ProfileBlocked');
  // helpers
  const header = (() => {
    return t('Seu cadastro está bloqueado :(');
  })();
  // UI
  return (
    <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
      <View>
        <SituationHeader variant="blocked" />
        <BlockProcessContent variant="blocked" />
        <PaddedView>
          <DeliveryProblemCard
            title={t('Suporte AppJusto')}
            subtitle={t('Fale com a gente através do nosso WhatsApp')}
            onPress={() => {
              track('opening whatsapp chat with backoffice');
              Linking.openURL(AppJustoAssistanceWhatsAppURL);
            }}
            situation="chat"
          />
        </PaddedView>
      </View>
    </ScrollView>
  );
}
