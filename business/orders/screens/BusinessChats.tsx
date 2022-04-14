import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessNavParamsList } from '../../types';
import { ChatKanbanItem } from '../components/ChatKanbanItem';
import { ListFilterButton } from '../components/ListFilterButton';
type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'BusinessOrders'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'BusinessOrders'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

type ChatFilter = 'today' | 'lastSevenDays';

export const BusinessChats = ({ navigation, route }: Props) => {
  // const showChatButton = useChatisEnabled(order); use this to show or hide chat buttons in the chats.map()
  // define active orders using statuses

  // const showChatButton =
  // state
  const [chatFilter, setChatFilter] = React.useState<ChatFilter>('today');
  const noChatToday = false;
  //UI
  return (
    <View style={{ ...screens.config }}>
      <View style={{ flexDirection: 'row', marginTop: padding, marginHorizontal: padding }}>
        <ListFilterButton
          title={t('Hoje')}
          selected={chatFilter === 'today'}
          onPress={() => setChatFilter('today')}
          style={{ marginRight: halfPadding }}
        />
        <ListFilterButton
          title={t('Últimos 7 dias')}
          selected={chatFilter === 'lastSevenDays'}
          onPress={() => setChatFilter('lastSevenDays')}
          style={{ marginRight: halfPadding }}
        />
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        style={{ ...screens.config, padding }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {noChatToday ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.grey50,
              flex: 1,
            }}
          >
            <IconOnboardingDelivery circleColor={colors.white} />
            <Text
              style={{
                textAlign: 'center',
                ...texts.sm,
                color: colors.grey700,
                paddingTop: padding,
              }}
            >
              {t('Você ainda não teve mensagens hoje')}
            </Text>
          </View>
        ) : (
          <ChatKanbanItem />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};
