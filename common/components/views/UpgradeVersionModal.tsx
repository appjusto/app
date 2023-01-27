import { compare } from 'compare-versions';
import React from 'react';
import { Linking, Modal, ModalProps, Platform, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getFlavor } from '../../../common/store/config/selectors';
import { t } from '../../../strings';
import { usePlatformAccess } from '../../hooks/usePlatformAccess';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { colors, doublePadding, halfPadding, padding, texts } from '../../styles';
import { getAppVersion } from '../../utils/version';
import DefaultButton from '../buttons/DefaultButton';

type UpdateDetail = 'updated' | 'restart-update' | 'store-update';

export const UpgradeVersionModal = (props: ModalProps) => {
  // context
  const platformAccess = usePlatformAccess();
  // redux
  const flavor = useSelector(getFlavor);
  // state
  const [minVersion, setMinVersion] = React.useState<string>();
  const [updateDetail, setUpdateDetail] = React.useState<UpdateDetail>();
  const [modalVisible, setModalVisible] = React.useState(false);
  // effects
  React.useEffect(() => {
    if (!platformAccess) return;
    if (flavor === 'consumer' && platformAccess.minVersions?.consumer) {
      setMinVersion(platformAccess.minVersions.consumer);
    } else if (flavor === 'courier' && platformAccess.minVersions?.courier) {
      setMinVersion(platformAccess.minVersions.courier);
    }
  }, [flavor, platformAccess]);
  React.useEffect(() => {
    if (!minVersion) return;
    if (!compare(getAppVersion(), minVersion, '<')) setUpdateDetail('updated');
    else {
      const majorCurrent = getAppVersion().split('.')[0];
      const majorMin = minVersion.split('.')[0];
      if (majorCurrent === majorMin) setUpdateDetail('restart-update');
      else setUpdateDetail('store-update');
    }
  }, [minVersion]);
  React.useEffect(() => {
    setModalVisible(updateDetail === 'restart-update' || updateDetail === 'store-update');
  }, [updateDetail]);
  // handlers
  const onUpgradeHandler = () => {
    if (flavor === 'consumer') {
      if (Platform.OS === 'android') {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=br.com.appjusto.consumer.live&hl=pt_BR&gl=US'
        );
      } else {
        Linking.openURL('https://apps.apple.com/br/app/appjusto/id1569067601');
      }
    } else
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=br.com.appjusto.consumer.live&hl=pt_BR&gl=US'
      );
  };
  // UI
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
          <View style={{ alignItems: 'center', marginBottom: padding, marginTop: halfPadding }}>
            <Pressable delayLongPress={3000} onLongPress={() => setModalVisible(false)}>
              <IconLogoGreen />
            </Pressable>
          </View>
          <View style={{ marginBottom: padding }}>
            <Text style={{ ...texts.x2l }}>Atualização necessária</Text>
            <Text style={{ ...texts.md, marginTop: padding }}>
              {updateDetail === 'restart-update'
                ? t('Para continuar utilizando o AppJusto, feche o aplicativo e o abra novamente.')
                : null}
              {updateDetail === 'store-update'
                ? t('Para continuar utilizando o AppJusto, baixe a versão mais nova na loja.')
                : null}
            </Text>
            <Text style={{ ...texts.md, marginTop: 24 }}>
              {t('Versão mínima:')} {minVersion}
            </Text>
            <Text style={{ ...texts.md, marginTop: halfPadding }}>
              {t('Versão atual:')} {getAppVersion()}
            </Text>
          </View>
          {updateDetail === 'store-update' ? (
            <View>
              <DefaultButton title={t('Atualizar agora')} onPress={onUpgradeHandler} />
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
