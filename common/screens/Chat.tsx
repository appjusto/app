import { ChatMessage, ChatMessageType, Flavor, WithId } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { BusinessAppContext } from '../../business/BusinessAppContext';
import { t } from '../../strings';
import { ApiContext } from '../app/context';
import DefaultButton from '../components/buttons/DefaultButton';
import PaddedView from '../components/containers/PaddedView';
import RoundedProfileImg from '../components/icons/RoundedProfileImg';
import DefaultInput from '../components/inputs/DefaultInput';
import useTallerDevice from '../hooks/useTallerDevice';
import { useObserveOrder } from '../store/api/order/hooks/useObserveOrder';
import { unreadMessages, useObserveOrderChat } from '../store/api/order/hooks/useObserveOrderChat';
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
  const tallerDevice = useTallerDevice();
  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser)!;
  const { business } = React.useContext(BusinessAppContext);
  const agentId = flavor === 'business' ? business!.id : user.uid;
  // screen state
  const order = useObserveOrder(orderId);
  const chat = useObserveOrderChat(orderId, user.uid, counterpartId, counterpartFlavor, flavor);
  const unread = unreadMessages(chat, user.uid);
  const [inputText, setInputText] = React.useState('');
  // side effects
  // tracking
  useSegmentScreen('Chat', {
    flavor,
    counterpartFlavor,
  });
  React.useEffect(() => {
    if (unread.length > 0) {
      api.order().updateReadMessages(unread.map((message) => message.id));
    }
  }, [api, orderId, unread]);

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
    const type = (() => {
      if (flavor === 'business') return `business-${counterpartFlavor}`;
      if (flavor === 'consumer') {
        if (counterpartFlavor === 'business') return 'business-consumer';
      }
      if (flavor === 'courier') {
        if (counterpartFlavor === 'business') return 'business-courier';
      } else return 'consumer-courier';
    })() as ChatMessageType;
    const participantsIds =
      counterpartFlavor === 'courier' ? [agentId, counterpartId] : [counterpartId, agentId];
    const to: { agent: Flavor; id: string } = {
      agent: counterpartFlavor,
      id: counterpartId,
    };
    api.order().sendMessage({
      orderId,
      type,
      participantsIds,
      from: {
        agent: flavor,
        id: agentId,
        name:
          flavor === 'consumer'
            ? order.consumer.name ?? t('Cliente')
            : flavor === 'business'
            ? order.business?.name ?? t('Restaurante')
            : order.courier?.name ?? t('Entregador/a'),
      },
      to,
      message: inputText.trim(),
      // orderStatus: order.status,
    });
    setInputText('');
  };
  const getName = (from: string) => {
    if (flavor === 'business') {
      if (from === user.uid) return order.business?.name ?? t('Restaurante');
      else if (from === order.consumer.id) return order.consumer.name ?? t('Cliente');
      else if (from === order.courier?.id) return order.courier.name ?? t('Entregador/a');
    } else {
      if (from === order.consumer.id) return order.consumer.name ?? t('Cliente');
      else if (from === order.courier?.id) return order.courier.name ?? t('Entregador/a');
      else if (from === order.business?.id) return order.business.name ?? t('Restaurante');
      else return 'Suporte';
    }
  };
  const getImageFlavor = (from: string) => {
    if (flavor === 'business') {
      if (from === user.uid) return 'business';
      else if (from === order.consumer.id) return 'consumer';
      else if (from === order.courier?.id) return 'courier';
    } else {
      if (from === order.consumer.id) return 'consumer';
      else if (from === order.courier?.id) return 'courier';
      else if (from === order.business?.id) return 'business';
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[screens.default]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? (tallerDevice ? 60 : 40) : -172}
    >
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={chat}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: colors.grey500 }}
        renderItem={({ item }) => {
          // console.log(item.from, user.uid);
          // console.log(item.id);
          // console.log(getImageFlavor(item.from));
          return (
            <PaddedView
              style={{
                backgroundColor: colors.grey50,
                borderTopColor: colors.grey500,
                borderTopWidth: 1,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RoundedProfileImg flavor={getImageFlavor(item.from)} id={item.from} />
                <View style={{ marginVertical: halfPadding }}>
                  <Text style={{ ...texts.md }}>{getName(item.from)}</Text>
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
          );
        }}
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
