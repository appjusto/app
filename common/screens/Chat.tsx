import { RouteProp } from '@react-navigation/native';
import { ChatMessage, Flavor, WithId } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import DefaultButton from '../components/buttons/DefaultButton';
import PaddedView from '../components/containers/PaddedView';
import RoundedProfileImg from '../components/icons/RoundedProfileImg';
import DefaultInput from '../components/inputs/DefaultInput';
import useObserveOrder from '../store/api/order/hooks/useObserveOrder';
import { getFlavor } from '../store/config/selectors';
import { markMessageAsRead } from '../store/order/actions';
import { groupOrderChatMessages } from '../store/order/selectors';
import { getUser } from '../store/user/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../styles';
import { formatTime } from '../utils/formatters';

export type ChatParamList = {
  Chat: {
    orderId: string;
  };
};

type ScreenRoute = RouteProp<ChatParamList, 'Chat'>;

type Props = {
  route: ScreenRoute;
};

export default function ({ route }: Props) {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser)!;
  // screen state
  const { order, chat } = useObserveOrder(orderId);

  const [inputText, setInputText] = React.useState('');
  const groupedMessages = React.useMemo(() => groupOrderChatMessages(chat ?? []), [chat]);
  // side effects
  React.useEffect(() => {
    if (chat && chat.length > 0) {
      dispatch(markMessageAsRead(orderId, chat[chat.length - 1]));
    }
  }, [chat]);
  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  // UI handlers
  const sendMessageHandler = () => {
    const to: { agent: Flavor; id: string } = {
      agent: flavor === 'consumer' ? 'courier' : 'consumer',
      id: user.uid === order?.consumer.id ? order?.courier?.id! : order?.consumer?.id!,
    };
    api.order().sendMessage(orderId, {
      from: { agent: flavor, id: user.uid },
      to,
      message: inputText.trim(),
    });
    setInputText('');
  };
  const names = {
    [order.courier!.id]: order.courier!.name,
    [order.consumer!.id]: order.consumer!.name ?? t('Cliente'),
  };
  return (
    <View style={[screens.default]}>
      <KeyboardAwareFlatList
        keyboardShouldPersistTaps="always"
        data={groupedMessages}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: colors.grey }}
        renderItem={({ item }) => (
          <PaddedView
            style={{
              backgroundColor: colors.lightGrey,
              borderTopColor: colors.grey,
              borderTopWidth: 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RoundedProfileImg
                flavor={item.from === order.courier!.id ? 'courier' : 'consumer'}
                id={item.from}
              />
              <View style={{ marginLeft: padding / 2 }}>
                <Text style={[texts.medium]}>{names[item.from]}</Text>
              </View>
            </View>
            {item.messages.map((message: WithId<ChatMessage>) => (
              <PaddedView
                key={message.id}
                style={{
                  backgroundColor: colors.white,
                  ...borders.default,
                  marginTop: padding / 2,
                  alignSelf: 'flex-start',
                }}
                padding={12}
              >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Text style={[texts.small, { flexWrap: 'wrap' }]}>{message.message}</Text>
                  <Text style={[texts.tiny, { marginLeft: halfPadding, alignSelf: 'flex-end' }]}>
                    {message.timestamp
                      ? formatTime((message.timestamp as firebase.firestore.Timestamp).toDate())
                      : ''}
                  </Text>
                </View>
              </PaddedView>
            ))}
          </PaddedView>
        )}
        inverted
      />

      <PaddedView style={{ backgroundColor: colors.white }}>
        <DefaultInput
          value={inputText}
          placeholder={t('Escreva sua mensagem')}
          onChangeText={setInputText}
          multiline
          numberOfLines={3}
          onSubmitEditing={sendMessageHandler}
          blurOnSubmit
        >
          <DefaultButton
            style={{ marginLeft: padding }}
            title={t('Enviar')}
            onPress={sendMessageHandler}
            disabled={inputText.length === 0}
          />
        </DefaultInput>
      </PaddedView>
    </View>
  );
}
