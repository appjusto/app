import { ChatMessage, Flavor, PushMessage, WithId } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { t } from '../../strings';
import { ApiContext } from '../app/context';
import DefaultButton from '../components/buttons/DefaultButton';
import PaddedView from '../components/containers/PaddedView';
import RoundedProfileImg from '../components/icons/RoundedProfileImg';
import DefaultInput from '../components/inputs/DefaultInput';
import { useObserveOrder } from '../store/api/order/hooks/useObserveOrder';
import { useObserveOrderChat } from '../store/api/order/hooks/useObserveOrderChat';
import { useSegmentScreen } from '../store/api/track';
import { getFlavor } from '../store/config/selectors';
import { getUser } from '../store/user/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../styles';
import { formatTime } from '../utils/formatters';

export type ChatParamList = {
  Chat: {
    orderId: string;
    counterpartId: string;
    counterpartFlavor: Flavor;
  };
};

type ScreenRoute = RouteProp<ChatParamList, 'Chat'>;

type Props = {
  route: ScreenRoute;
};

export default function ({ route }: Props) {
  // params
  const { orderId, counterpartId, counterpartFlavor } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const queryClient = useQueryClient();
  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser)!;
  // screen state
  const order = useObserveOrder(orderId);
  const chat = useObserveOrderChat(orderId, user.uid, counterpartId);
  const [inputText, setInputText] = React.useState('');
  // side effects
  // tracking
  useSegmentScreen('Chat');
  React.useEffect(() => {
    queryClient.setQueryData(
      ['notifications', 'order-chat'],
      (notifications: PushMessage[] | undefined) =>
        (notifications ?? []).map((n) =>
          n.data.orderId === orderId && n.data.from === counterpartId ? { ...n, read: true } : n
        )
    );
  }, [chat, queryClient, counterpartId, orderId]);
  console.log(chat);

  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // UI handlers
  const sendMessageHandler = () => {
    if (!inputText) return;
    const to: { agent: Flavor; id: string } = {
      agent: counterpartFlavor,
      id: counterpartId,
    };
    api.order().sendMessage(orderId, {
      from: { agent: flavor, id: user.uid },
      to,
      message: inputText.trim(),
    });
    setInputText('');
  };
  const getName = (from: string) => {
    if (from === order.consumer.id) return order.consumer.name ?? t('Cliente');
    else if (from === order.courier?.id) return order.courier.name ?? t('Entregador');
    else if (from === order.business?.id) return order.business.name ?? t('Restaurante');
    else return 'Suporte';
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[screens.default]}
    >
      <FlatList
        keyboardShouldPersistTaps="never"
        data={chat}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: colors.grey500 }}
        renderItem={({ item }) => (
          <PaddedView
            style={{
              backgroundColor: colors.grey50,
              borderTopColor: colors.grey500,
              borderTopWidth: 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RoundedProfileImg
                flavor={item.from === order.courier!.id ? 'courier' : 'consumer'}
                id={item.from}
              />
              <View style={{ marginLeft: padding / 2 }}>
                <Text style={[texts.md]}>{getName(item.from)}</Text>
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
                  <Text style={{ ...texts.sm, flexWrap: 'wrap' }}>{message.message}</Text>
                  <Text
                    style={{
                      ...texts.xs,
                      color: colors.grey700,
                      marginLeft: halfPadding,
                      alignSelf: 'flex-end',
                    }}
                  >
                    {message.timestamp ? formatTime(message.timestamp) : ''}
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
    </KeyboardAvoidingView>
  );
}
