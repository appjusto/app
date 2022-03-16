import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ModalProps {
  modalVisible: boolean;
  onModalClose: () => void;
  onCancelOrder: () => void;
}

export const CancelOrderModal = ({ onModalClose, modalVisible, onCancelOrder }: Props) => {
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
          <View style={{ paddingHorizontal: padding, marginBottom: 24 }}>
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Text style={{ ...texts.xl }}>{t('Cancelar pedido')}</Text>
                <MaterialIcons name="close" size={20} />
              </View>
            </TouchableOpacity>
            <Text style={{ ...texts.sm, marginTop: padding }}>
              {t(
                'Você tem certeza que deseja cancelar esse pedido? O consumidor será notificado sobre o seu cancelamento.'
              )}
            </Text>
          </View>

          <View
            style={{
              paddingTop: halfPadding,
              borderTopColor: colors.grey500,
              borderTopWidth: 1,
            }}
          >
            <View
              style={{
                paddingHorizontal: padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ width: '48%' }}>
                <DefaultButton title={t('Aceitar pedido')} />
              </View>
              <View style={{ width: '48%' }}>
                <DefaultButton
                  title={t('Cancelar pedido')}
                  grey
                  style={{ backgroundColor: colors.red }}
                  onPress={onCancelOrder}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
