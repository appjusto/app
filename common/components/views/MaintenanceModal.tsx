import { PlatformAccess } from '@appjusto/types';
import React from 'react';
import { Modal, ModalProps, Pressable, Text, View } from 'react-native';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { colors, doublePadding, halfPadding, texts } from '../../styles';

export interface MaintenanceModalProps extends ModalProps {
  modalData?: PlatformAccess;
}

export const MaintenanceModal = ({ modalData, ...props }: MaintenanceModalProps) => {
  // screen state
  const [modalVisible, setModalVisible] = React.useState(true);
  return modalData?.maintenance.active ? (
    <Modal transparent {...props} visible={modalVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            marginHorizontal: doublePadding,
            backgroundColor: colors.white,
            padding: doublePadding,
            borderRadius: halfPadding,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Pressable delayLongPress={3000} onLongPress={() => setModalVisible(false)}>
              <IconLogoGreen />
            </Pressable>
          </View>
          <Text style={{ ...texts.xl, textAlign: 'center' }}>
            {modalData?.maintenance.header ?? ''}
          </Text>
          {modalData?.maintenance.body?.length
            ? modalData.maintenance.body.map((text) => (
                <Text key={text} style={{ ...texts.md, marginTop: 24, textAlign: 'center' }}>
                  {text}
                </Text>
              ))
            : null}
          <View style={{ marginBottom: 24 }} />
        </View>
      </View>
    </Modal>
  ) : null;
};
