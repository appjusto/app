import { Order, WithId } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native';
import * as Sentry from 'sentry-expo';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import { track } from '../../../common/store/api/track';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ModalProps {
  order: WithId<Order>;
  modalVisible: boolean;
  onModalClose: () => void;
  buttonTitle: string;
}

export const CookingTimeModal = ({ order, onModalClose, modalVisible, buttonTitle }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [cookingTime, setCookingTime] = React.useState(1200);
  const [isLoading, setLoading] = React.useState(false);
  const confirmOrderHandler = async () => {
    track('restaurant confirmed order');
    try {
      setLoading(true);
      // if business has not confirmed order yet, set cooking time and set status to 'preparing'
      if (order.status === 'confirmed') {
        await api.order().updateOrder(order.id, { cookingTime, status: 'preparing' });
      }
      // if status === 'preparing' only set cooking time
      else {
        await api.order().updateOrder(order.id, { cookingTime });
      }
      setLoading(false);
      onModalClose();
    } catch (error) {
      setLoading(false);
      console.log(error);
      Sentry.Native.captureException(error);
    }
  };
  return (
    <Modal transparent visible={modalVisible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            ...borders.default,
            paddingTop: padding,
            paddingBottom: halfPadding,
          }}
        >
          <View style={{ paddingHorizontal: padding, marginBottom: padding }}>
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Text style={{ ...texts.xl }}>{t('Definir tempo de preparo')}</Text>
                <MaterialIcons name="close" size={20} />
              </View>
            </TouchableOpacity>
            <Text style={{ ...texts.sm, marginTop: padding, color: colors.grey700 }}>
              {t(
                'Ao definir o tempo de preparo, quando finalizado esse tempo, o pedido será automaticamente movido para ”Aguardando retirada”'
              )}
            </Text>
          </View>
          <View style={{ paddingHorizontal: padding }}>
            <RadioButton
              title={t('5 minutos')}
              onPress={() => setCookingTime(300)}
              checked={cookingTime === 300}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('10 minutos')}
              onPress={() => setCookingTime(600)}
              checked={cookingTime === 600}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('15 minutos')}
              onPress={() => setCookingTime(900)}
              checked={cookingTime === 900}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('20 minutos')}
              onPress={() => setCookingTime(1200)}
              checked={cookingTime === 1200}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('30 minutos')}
              onPress={() => setCookingTime(1800)}
              checked={cookingTime === 1800}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('45 minutos')}
              onPress={() => setCookingTime(2700)}
              checked={cookingTime === 2700}
            />
          </View>
          <View
            style={{
              paddingTop: halfPadding,
              borderTopColor: colors.grey500,
              borderTopWidth: 1,
              marginTop: 24,
            }}
          >
            <View style={{ paddingHorizontal: padding }}>
              <DefaultButton title={buttonTitle} onPress={confirmOrderHandler} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
