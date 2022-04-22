import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderChatGroup } from '../../hooks/useBusinessChats';

type Props = {
  chat: OrderChatGroup;
  onCheckOrder: () => void;
};

export const ChatKanbanItem = ({ chat, onCheckOrder }: Props) => {
  // screen state
  const order = useObserveOrder(chat.orderId);
  // UI
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: padding,
        ...borders.default,
        backgroundColor: colors.white,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <RoundedText backgroundColor={colors.grey50} color={colors.black} noBorder>
          Flavor
        </RoundedText>
        <Text style={{ ...texts.x2s }}>ENVIADO ÀS 00h00</Text>
      </View>
      <View style={{ marginVertical: padding }}>
        <Text style={{ ...texts.sm }}>{order?.consumer.name}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: '38%' }}>
          <DefaultButton secondary title={t('Ver pedido')} onPress={onCheckOrder} />
        </View>
        <View style={{ width: '57%' }}>
          {/* while there is no new message in an ongoing chat, this button will look like a "disabled" one */}
          <DefaultButton title={t('Nova mensagem')} onPress={() => null} />
        </View>
      </View>
    </View>
  );
};
