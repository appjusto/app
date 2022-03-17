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
  const [cookingTime, setCookingTime] = React.useState(5);
  const [isLoading, setLoading] = React.useState(false);
  // aqui dentro, ele vai chamar uma update order
  const confirmOrderHandler = async () => {
    track('restaurant confirmed order');
    try {
      setLoading(true);
      // turn status into 'preparing' and setting cooking time
      await api
        .order()
        .updateOrder(order.id, { cookingTime: cookingTime * 60, status: 'preparing' });
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
              onPress={() => setCookingTime(5)}
              checked={cookingTime === 5}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('10 minutos')}
              onPress={() => setCookingTime(10)}
              checked={cookingTime === 10}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('15 minutos')}
              onPress={() => setCookingTime(15)}
              checked={cookingTime === 15}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('20 minutos')}
              onPress={() => setCookingTime(20)}
              checked={cookingTime === 20}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('30 minutos')}
              onPress={() => setCookingTime(30)}
              checked={cookingTime === 30}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('45 minutos')}
              onPress={() => setCookingTime(45)}
              checked={cookingTime === 45}
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
