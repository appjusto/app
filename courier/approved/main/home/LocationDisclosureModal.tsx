import React from 'react';
import { ModalProps } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../common/app/context';
import { DefaultModal } from '../../../../common/components/views/DefaultModal';
import { updateShownLocationDisclosure } from '../../../../common/store/courier/actions';
import { t } from '../../../../strings';

interface Props extends ModalProps {
  onDismiss: () => void;
}

export const LocationDisclosureModal = ({ onDismiss, ...props }: Props) => {
  // context
  const dispatch = useDispatch<AppDispatch>();
  // UI
  return (
    <DefaultModal
      header={t('Compartilhamento da localização')}
      body={t(
        'O AppJusto coleta a localização somente quando você estiver disponível, para permitir o envio de corridas mais próximas e o acompanhamento das entregas. Isso também pode ocorrer com o aplicativo fechado ou sem uso no momento.'
      )}
      dismissButtonTitle={t('Ok, entendi')}
      onDismiss={() => {
        dispatch(updateShownLocationDisclosure(true));
        onDismiss();
      }}
      {...props}
    />
  );
};
