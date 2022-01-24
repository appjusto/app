import React from 'react';
import { Modal, ModalProps, Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getFlavor } from '../../../common/store/config/selectors';
import { usePlatformAccess } from '../../hooks/usePlatformAccess';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { colors, doublePadding, halfPadding } from '../../styles';
import { isCurrentVersionAllowed } from '../../utils/version';

export const UpgradeVersionModal = (props: ModalProps) => {
  // context
  const platformAccess = usePlatformAccess();
  const flavor = useSelector(getFlavor);
  const minVersion =
    flavor === 'consumer'
      ? platformAccess?.minVersions.consumer
      : platformAccess?.minVersions.courier;
  const isThisVersionOk = !!minVersion && isCurrentVersionAllowed(minVersion);
  // screen state
  const [modalVisible, setModalVisible] = React.useState(true);
  return (
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
          <View style={{ alignItems: 'center', marginBottom: 24, marginTop: halfPadding }}>
            <Pressable delayLongPress={3000} onLongPress={() => setModalVisible(false)}>
              <IconLogoGreen />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
