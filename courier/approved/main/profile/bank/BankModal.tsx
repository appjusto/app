import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { borders, colors, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

type Props = {
  modalVisible: boolean;
  onModalClose: () => void;
};

export const BankModal = ({ modalVisible, onModalClose }: Props) => {
  return (
    <Modal transparent animationType="slide" visible={modalVisible}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <PaddedView style={{ backgroundColor: colors.white, ...borders.default }}>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name="close" size={24} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ ...texts.xl }}>
            {t('Tem certeza que a sua conta\n bancária é de Pessoa Jurídica?')}
          </Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginVertical: padding }}>
            {t(
              'Essa informação é muito importante para que as transferências sejam feitas corretamente. Só escolha Pessoa Jurídica caso tenha certeza que sua conta bancária está configurada dessa forma.'
            )}
          </Text>
        </PaddedView>
      </View>
    </Modal>
  );
};
