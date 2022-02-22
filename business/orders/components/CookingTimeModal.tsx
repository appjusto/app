import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ModalProps {
  modalVisible: boolean;
  onModalClose: () => void;
  onConfirmOrder: () => void;
  buttonTitle: string;
}

export const CookingTimeModal = ({
  onModalClose,
  modalVisible,
  onConfirmOrder,
  buttonTitle,
}: Props) => {
  // state
  const [cookingTime, setCookingTime] = React.useState('5 minutos');
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
              onPress={() => setCookingTime('5 minutos')}
              checked={cookingTime === '5 minutos'}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('10 minutos')}
              onPress={() => setCookingTime('10 minutos')}
              checked={cookingTime === '10 minutos'}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('15 minutos')}
              onPress={() => setCookingTime('15 minutos')}
              checked={cookingTime === '15 minutos'}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('20 minutos')}
              onPress={() => setCookingTime('20 minutos')}
              checked={cookingTime === '20 minutos'}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('30 minutos')}
              onPress={() => setCookingTime('30 minutos')}
              checked={cookingTime === '30 minutos'}
              style={{ marginBottom: padding }}
            />
            <RadioButton
              title={t('45 minutos')}
              onPress={() => setCookingTime('45 minutos')}
              checked={cookingTime === '45 minutos'}
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
              <DefaultButton title={buttonTitle} onPress={onConfirmOrder} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
