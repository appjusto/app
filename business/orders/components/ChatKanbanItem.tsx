import { ChatMessage, ChatMessageUser } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import { useChatIsEnabled } from '../../../common/hooks/useChatIsEnabled';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';

type Props = {
  message: ChatMessage;
  counterpart: ChatMessageUser;
  onCheckOrder: () => void;
  onOpenChat: () => void;
};

export const ChatKanbanItem = ({ message, counterpart, onCheckOrder, onOpenChat }: Props) => {
  // screen state
  const order = useObserveOrder(message.orderId);
  const chatStillActive = useChatIsEnabled(order);
  // helpers
  const flavorLabel = (() => {
    if (counterpart.agent === 'consumer') return t('Cliente');
    if (counterpart.agent === 'courier') return t('Entregador');
    else return t('AppJusto');
  })();
  const redCircle = (() => {
    if (!message.read)
      return (
        <View
          style={{
            backgroundColor: colors.red,
            height: 12,
            width: 12,
            borderRadius: 6,
            marginRight: halfPadding,
          }}
        />
      );
  })();
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
        {/* TODO: if there is a new message, there should be a red circle to the left of this RoundedText */}
        <RoundedText
          backgroundColor={colors.grey50}
          color={colors.black}
          noBorder
          leftIcon={redCircle}
        >
          {flavorLabel}
        </RoundedText>
        {message.timestamp ? (
          <Text style={{ ...texts.x2s }}>
            {t('ENVIADO ÀS')} {formatTime(message.timestamp)}
          </Text>
        ) : null}
      </View>
      <View style={{ marginVertical: padding }}>
        <Text style={{ ...texts.sm }}>{counterpart.name}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: '38%' }}>
          <DefaultButton variant="secondary" title={t('Ver pedido')} onPress={onCheckOrder} />
        </View>
        <View style={{ width: '57%' }}>
          <DefaultButton
            title={message.read ? t('Abrir chat') : t('Nova mensagem')}
            grey={message.read}
            onPress={onOpenChat}
          />
        </View>
      </View>
    </View>
  );
};
