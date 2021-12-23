import React from 'react';
import { Modal, ModalProps, Pressable, Text, View } from 'react-native';
import { usePlatformAccess } from '../../hooks/usePlatformAccess';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { colors, doublePadding, halfPadding, texts } from '../../styles';

export const MaintenanceModal = (props: ModalProps) => {
  const platformAccess = usePlatformAccess();
  // screen state
  const [modalVisible, setModalVisible] = React.useState(true);
  // UI
  return platformAccess?.maintenance.active ? (
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
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                alignItems: 'center',
                marginBottom: 24,
                height: 114,
                width: 114,
                borderRadius: 57,
                backgroundColor: colors.grey50,
                justifyContent: 'center',
              }}
            >
              {platformAccess.maintenance.icon ? (
                <Text style={{ ...texts.x5l }}>
                  {String.fromCodePoint(platformAccess.maintenance.icon ?? '')}
                </Text>
              ) : null}
            </View>
          </View>
          <Text style={{ ...texts.xl, textAlign: 'center' }}>
            {platformAccess.maintenance.header ?? ''}
          </Text>
          {platformAccess.maintenance.body?.length
            ? platformAccess.maintenance.body.map((text) => (
                <Text key={text} style={{ ...texts.md, marginTop: 24, textAlign: 'center' }}>
                  {text}
                </Text>
              ))
            : null}
          <View style={{ marginBottom: 24 }} />
          <View style={{ alignItems: 'center', marginBottom: 24, marginTop: halfPadding }}>
            <Pressable delayLongPress={3000} onLongPress={() => setModalVisible(false)}>
              <IconLogoGreen />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  ) : null;
};
