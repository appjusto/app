import * as Linking from 'expo-linking';
import React from 'react';
import { Modal, ModalProps, Platform, Text, View } from 'react-native';
import { t } from '../../../strings';
import { AppJustoAppStore, AppJustoGooglePlay } from '../../../strings/values';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { colors, doublePadding, halfPadding, padding, texts } from '../../styles';
import DefaultButton from '../buttons/DefaultButton';

export interface MaintenanceModalProps extends ModalProps {
  modalKind: 'upgrade' | 'maintenance';
}

export const MaintenanceModal = ({ modalKind, ...props }: MaintenanceModalProps) => {
  // helpers
  const header =
    modalKind === 'maintenance'
      ? t('No momento, estamos realizando uma manutenção no aplicativo')
      : t('Você precisa atualizar o aplicativo');
  const description =
    modalKind === 'maintenance'
      ? t(
          'Para manter a qualidade das entregas, precisamos realizar manutenções esporádicas. Em breve, o AppJusto estará disponível para os seus pedidos. Tente novamente mais tarde.'
        )
      : t(
          'Você está utilizando uma versão antiga do AppJusto. Atualizações são importantes, pois mantém o aplicativo funcionando da melhor maneira para os seus pedidos.'
        );
  const bottomText =
    modalKind === 'maintenance'
      ? t('Obrigado por fazer parte desse movimento!')
      : t('Por favor, atualize seu aplicativo para continuar usando.');
  // handler
  const onUpgradeHandler = () => {
    if (Platform.OS === 'android') {
      Linking.openURL(AppJustoGooglePlay);
    } else if (Platform.OS === 'ios') {
      Linking.openURL(AppJustoAppStore);
    }
  };
  return (
    <Modal transparent {...props}>
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
            <IconLogoGreen />
          </View>
          <Text style={{ ...texts.xl, textAlign: 'center' }}>{header}</Text>
          <Text style={{ ...texts.md, marginVertical: doublePadding }}>{description}</Text>
          <Text style={{ ...texts.md, marginBottom: padding }}>{bottomText}</Text>
          {modalKind === 'upgrade' ? (
            <View style={{ marginTop: padding }}>
              <DefaultButton title={t('Atualizar agora')} onPress={onUpgradeHandler} />
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
