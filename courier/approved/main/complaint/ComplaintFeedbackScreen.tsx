import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { IconSupport } from '../../../../common/icons/icon-support';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { colors, doublePadding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../../strings/values';
import { ApprovedParamList } from '../../types';
import { IconComplainFeedback } from './icon';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'ComplaintFeedbackScreen'>;

type ScreenRouteProp = RouteProp<ApprovedParamList, 'ComplaintFeedbackScreen'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ComplaintFeedbackScreen = ({ navigation, route }: Props) => {
  // state
  // UI
  return (
    <View style={{ ...screens.default, backgroundColor: colors.primary }}>
      <PaddedView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} />
        <View style={{ alignItems: 'center' }}>
          <IconComplainFeedback />
          <View
            style={{
              paddingHorizontal: doublePadding,
              marginTop: doublePadding,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                ...texts.xl,
                // marginBottom: doublePadding,
              }}
            >
              Denuncia enviada!
            </Text>
            <Text
              style={{
                ...texts.xs,
                color: colors.grey800,
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              Iremos analisar seu caso e entrar em contato em breve
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(AppJustoAssistanceWhatsAppURL);
          }}
        >
          <HomeCard
            icon={<IconSupport />}
            title={t('Preciso de ajuda')}
            subtitle={t('Fale com nosso time através do WhatsApp')}
          />
        </TouchableOpacity>
      </PaddedView>
    </View>
  );
};
