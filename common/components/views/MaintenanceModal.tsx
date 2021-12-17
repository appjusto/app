import { PlatformAccess } from '@appjusto/types';
import React from 'react';
import { Modal, ModalProps, Text, View } from 'react-native';
import { t } from '../../../strings';
import { IconLogoGreen } from '../../icons/icon-logoGreen';
import { colors, doublePadding, halfPadding, texts } from '../../styles';

export interface MaintenanceModalProps extends ModalProps {
  modalData?: PlatformAccess;
}

export const MaintenanceModal = ({ modalData, ...props }: MaintenanceModalProps) => {
  // helpers
  const header =
    // modalData?.maintenance.active
    //   ? modalData.maintenance.header
    //   :
    t('Você precisa atualizar o aplicativo');
  const description = modalData?.maintenance.active
    ? t(
        'Para manter a qualidade das entregas, precisamos realizar manutenções esporádicas. Em breve, o AppJusto estará disponível para os seus pedidos. Tente novamente mais tarde.'
      )
    : t(
        'Você está utilizando uma versão antiga do AppJusto. Atualizações são importantes, pois mantém o aplicativo funcionando da melhor maneira para os seus pedidos.'
      );
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
        </View>
      </View>
    </Modal>
  );
};
