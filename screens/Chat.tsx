import { RouteProp } from '@react-navigation/native';
import React, { useState, useCallback, useContext } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { sendMessage } from '../store/order/actions';
import { getOrderById, getOrderChat } from '../store/order/selectors';
import { getUser } from '../store/user/selectors';
import { t } from '../strings';
import { ApiContext, AppDispatch } from './app/context';
import DefaultButton from './common/DefaultButton';
import DefaultInput from './common/DefaultInput';
import { ProfileIcon } from './common/icons/RoundedIcon';
import { screens, colors, padding, texts, borders } from './common/styles';
import PaddedView from './common/views/PaddedView';

export type ChatParamList = {
  orderId: string;
};

type ScreenRoute = RouteProp<
  {
    Chat: ChatParamList;
  },
  'Chat'
>;

type Props = {
  route: ScreenRoute;
};

export default function ({ route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { orderId } = route.params;

  // app state
  const user = useSelector(getUser);
  const order = useSelector(getOrderById)(orderId);

  // screen state
  const [inputText, setInputText] = useState('');
  const orderChat = useSelector(getOrderChat(orderId));

  // handlers
  const sendMessageHandler = useCallback(async () => {
    dispatch(sendMessage(api)(order, user!.uid, inputText));
    setInputText('');
  }, [order, inputText]);
  // UI
  return (
    <View style={[screens.default]}>
      <FlatList
        data={orderChat}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: colors.darkGrey }}
        renderItem={({ item }) => (
          <PaddedView
            style={{
              backgroundColor: colors.lightGrey,
              borderTopColor: colors.grey,
              borderTopWidth: 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ProfileIcon />
              <View>
                <Text>{item.from}</Text>
                <Text>00h00</Text>
              </View>
            </View>
            {item.messages.map((message) => (
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
                <Text style={[texts.small]}>{message.message}</Text>
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
        >
          <DefaultButton
            title={t('Enviar')}
            onPress={sendMessageHandler}
            disabled={inputText.length === 0}
          />
        </DefaultInput>
      </PaddedView>
    </View>
  );
}
