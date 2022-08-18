import { compare } from 'compare-versions';
import React from 'react';
import { Linking, Modal, ModalProps, Platform, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getFlavor } from '../../../common/store/config/selectors';
import { t } from '../../../strings';
import { usePlatformAccess } from '../../hooks/usePlatformAccess';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { colors, doublePadding, halfPadding, padding, texts } from '../../styles';
import { getAppVersion, getNativeAndManifestVersion } from '../../utils/version';
import DefaultButton from '../buttons/DefaultButton';

export const UpgradeVersionModal = (props: ModalProps) => {
  // context
  const platformAccess = usePlatformAccess();
  const flavor = useSelector(getFlavor);
  const minVersion =
    flavor === 'consumer'
      ? platformAccess?.minVersions?.consumer
      : platformAccess?.minVersions?.courier;
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
  // screen state
  const [modalVisible, setModalVisible] = React.useState(false);
  // effects
  React.useEffect(() => {
    if (!minVersion) return;
    setModalVisible(compare(getAppVersion(), minVersion, '<'));
  }, [minVersion]);
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
            <Text style={{ ...texts.md }}>
              {t('Você está utilizando uma versão antiga do AppJusto - ')}
              <Text style={{ color: colors.red, textDecorationLine: 'underline' }}>
                {t('versão:')} {getNativeAndManifestVersion()}
              </Text>
              {t(
                '. Atualizações são importantes, pois mantém o aplicativo funcionando da melhor maneira para os seus pedidos.'
              )}
            </Text>
            <Text style={{ ...texts.md, marginTop: 24 }}>
              {t('Por favor, atualize seu aplicativo para continuar usando.')}
            </Text>
          </View>
          <View>
            <DefaultButton title={t('Atualizar agora')} onPress={onUpgradeHandler} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
