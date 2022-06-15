import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { first } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IconOnboardingDelivery } from '../../../common/icons/icon-onboarding-delivery';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessAppContext } from '../../BusinessAppContext';
import { BusinessNavParamsList } from '../../types';
import { ChatKanbanItem } from '../components/ChatKanbanItem';
import { ListFilterButton } from '../components/ListFilterButton';
import { getConversationKey } from '../helpers';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'BusinessOrders'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'BusinessOrders'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

type ChatFilter = 'open' | 'closed';

export const BusinessChats = ({ navigation, route }: Props) => {
  // context
  const { activeChats, completedOrdersChats, businessId } = React.useContext(BusinessAppContext);
  // state
  const [chatFilter, setChatFilter] = React.useState<ChatFilter>('open');
  const chats = chatFilter === 'open' ? activeChats : completedOrdersChats;
  //UI
  return (
    <View style={{ ...screens.config }}>
      <View style={{ flexDirection: 'row', marginTop: padding, marginHorizontal: padding }}>
        <ListFilterButton
          title={t('Abertos')}
          selected={chatFilter === 'open'}
          onPress={() => setChatFilter('open')}
          style={{ marginRight: halfPadding }}
        />
        <ListFilterButton
          title={t('Encerrados')}
          selected={chatFilter === 'closed'}
          onPress={() => setChatFilter('closed')}
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
        {!chats?.length ? (
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
              {t('Não há chats em aberto no momento')}
            </Text>
          </View>
        ) : (
          chats?.map((chat) => {
            const firstMessage = first(first(chat)?.messages);
            const orderId = firstMessage?.orderId;
            if (!orderId) return;
            const counterpart =
              firstMessage.from.id === businessId ? firstMessage.to : firstMessage.from;
            return (
              <View style={{ marginBottom: padding }} key={getConversationKey(firstMessage)}>
                <ChatKanbanItem
                  message={firstMessage}
                  counterpart={counterpart}
                  onCheckOrder={() => navigation.navigate('OrderDetail', { orderId })}
                  onOpenChat={() =>
                    navigation.navigate('OrderChat', {
                      orderId,
                      counterpartId: counterpart.id,
                      counterpartFlavor: counterpart.agent,
                    })
                  }
                  // onOpenChat={() => console.log(chat)}
                />
              </View>
            );
          })
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};
