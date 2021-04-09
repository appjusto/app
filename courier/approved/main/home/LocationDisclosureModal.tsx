import React from 'react';
import { Modal, ModalProps, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import { colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

interface Props extends ModalProps {
  onModalClose: () => void;
}

export const LocationDisclosureModal = ({ onModalClose, ...props }: Props) => {
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
            marginHorizontal: padding * 2,
            backgroundColor: colors.white,
            padding: padding * 2,
          }}
        >
          <Text style={{ ...texts.xl }}>{t('Compartilhamento da localização')}</Text>
          <Text style={{ ...texts.md, marginVertical: padding * 2 }}>
            {t(
              'O AppJusto coleta a localização somente quando você estiver disponível, para permitir o envio de corridas mais próximas e o acompanhamento das entregas. Isso também pode ocorrer com o aplicativo fechado ou sem uso no momento.'
            )}
          </Text>
          <DefaultButton title={t('Ok, entendi')} onPress={onModalClose} />
        </View>
      </View>
    </Modal>
  );
};
