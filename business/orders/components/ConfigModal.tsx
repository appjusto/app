import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ModalProps, Switch, Text, TouchableOpacity, View } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ModalProps {
  modalVisible: boolean;
  onModalClose: () => void;
}

export const ConfigModal = ({ modalVisible, onModalClose }: Props) => {
  // state
  const [receiveNotifications, setReceiveNotifications] = React.useState(true);
  const [printOrder, setPrintOrder] = React.useState(true);
  //UI
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
                <Text style={{ ...texts.xl }}>{t('Configurações')}</Text>
                <MaterialIcons name="close" size={20} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={{ ...texts.sm, marginTop: padding }}>
                {t('Receber notificação a cada pedido')}
              </Text>
              <View style={{ marginTop: halfPadding, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ borderWidth: 2, borderColor: colors.black, borderRadius: 16 }}>
                  <Switch
                    trackColor={{ false: colors.white, true: colors.white }}
                    thumbColor={receiveNotifications ? colors.green500 : colors.yellow}
                    ios_backgroundColor={colors.white}
                    onValueChange={() => setReceiveNotifications(!receiveNotifications)}
                    value={receiveNotifications}
                  />
                </View>
                <Text style={{ ...texts.sm, marginLeft: padding, color: colors.grey700 }}>
                  {receiveNotifications ? t('Ativado') : t('Desativado')}
                </Text>
              </View>
              <View
                style={{
                  borderTopColor: colors.grey500,
                  borderTopWidth: 1,
                  marginTop: 24,
                }}
              />
            </View>
            <View>
              <Text style={{ ...texts.sm, marginTop: padding }}>
                {t('Imprimir pedido ao confirmar')}
              </Text>
              <View style={{ marginTop: halfPadding, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ borderWidth: 2, borderColor: colors.black, borderRadius: 16 }}>
                  <Switch
                    trackColor={{ false: colors.white, true: colors.white }}
                    thumbColor={printOrder ? colors.green500 : colors.yellow}
                    ios_backgroundColor={colors.white}
                    onValueChange={() => setPrintOrder(!printOrder)}
                    value={printOrder}
                  />
                </View>
                <Text style={{ ...texts.sm, marginLeft: padding, color: colors.grey700 }}>
                  {printOrder ? t('Ativado') : t('Desativado')}
                </Text>
              </View>
              <View
                style={{
                  borderTopColor: colors.grey500,
                  borderTopWidth: 1,
                  marginTop: 24,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
