import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import Pill from '../../../common/components/views/Pill';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { IconSupport } from '../../../common/icons/icon-support';
import HomeCard from '../../../common/screens/home/cards/HomeCard';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, doublePadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { NeedHelpModal } from '../main/home/help/NeedHelpModal';
import { ApprovedParamList } from '../types';
import { DeliveryCompletedIcon } from './completed/completed';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'DeliveryCompleted'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'DeliveryCompleted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { fee, orderId } = route.params;
  // state
  const taller = useTallerDevice();
  const [supportModalVisible, setSupportModalVisible] = React.useState(false);
  // tracking
  useSegmentScreen('DeliveryCompleted');
  // handlers
  // UI
  return (
    <ScrollView
      style={{ ...screens.default }}
      scrollIndicatorInsets={{ right: 1 }}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: padding,
            paddingVertical: 60,
            alignItems: 'center',
            backgroundColor: colors.primary,
          }}
        >
          <DeliveryCompletedIcon />
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
                marginBottom: doublePadding,
              }}
            >
              Corrida finalizada!
            </Text>
            <Text
              style={{
                ...texts.xs,
                color: colors.grey800,
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              Valor recebido
            </Text>
            <Text
              style={{
                ...texts.lg,
                textAlign: 'center',
              }}
            >
              {formatCurrency(fee)}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <PaddedView style={{ flex: 1 }}>
            {!taller ? <View style={{ flex: 1 }} /> : null}
            <View style={{ position: 'absolute', top: padding }}>
              <Pill />
            </View>
            <Text style={{ ...texts.md }}>Teve algum problema com a corrida?</Text>
            <TouchableOpacity onPress={() => setSupportModalVisible(true)}>
              <HomeCard
                icon={<IconSupport />}
                title={t('Preciso de ajuda')}
                subtitle={t('Fale com nosso time ou faça uma denúncia')}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <DefaultButton
              title={t('Finalizar')}
              onPress={() => {
                navigation.replace('MainNavigator', { screen: 'Home' });
              }}
              style={{ marginVertical: padding }}
            />
          </PaddedView>
        </View>
        <NeedHelpModal
          visible={supportModalVisible}
          onClose={() => setSupportModalVisible(false)}
          onComplainPress={() => {
            setSupportModalVisible(false);
            setTimeout(() => {
              navigation.replace('ComplaintScreen', { orderId });
            }, 100);
          }}
        />
      </View>
    </ScrollView>
  );
}
