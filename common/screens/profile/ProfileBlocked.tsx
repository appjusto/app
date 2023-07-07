import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { ProfileIssuesParamsList } from '../../../courier/ProfileIssuesNavigator';
import { BlockProcessContent } from '../../../courier/approved/main/howitworks/blocks/BlockProcessContent';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { SituationHeader } from '../../../courier/common/situation-header/SituationHeader';
import { UnapprovedParamList } from '../../../courier/unapproved/types';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import { track, useSegmentScreen } from '../../store/api/track';
import { padding, screens, texts } from '../../styles';

type ScreenNavigationProp = StackNavigationProp<
  UnapprovedParamList & ProfileIssuesParamsList,
  'ProfileBlocked'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // tracking
  useSegmentScreen('ProfileBlocked');
  // UI
  return (
    <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
      <View>
        <SituationHeader variant="blocked" />
        <View style={{ paddingHorizontal: padding, marginTop: padding }}>
          <Text style={{ ...texts.xl, marginBottom: padding }}>
            Dúvidas? Fale com o nosso suporte
          </Text>
          <DeliveryProblemCard
            title={t('Suporte AppJusto')}
            subtitle={t('Fale com a gente através do nosso WhatsApp')}
            onPress={() => {
              track('opening whatsapp chat with backoffice');
              Linking.openURL(AppJustoAssistanceWhatsAppURL);
            }}
            situation="support"
          />
        </View>
        <BlockProcessContent variant="blocked" />
      </View>
    </ScrollView>
  );
}
