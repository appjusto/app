import { useNavigation } from '@react-navigation/core';
import { LOCATION, usePermissions } from 'expo-permissions';
import React from 'react';
import { Linking, ModalProps } from 'react-native';
import { DefaultModal } from '../../../../common/components/views/DefaultModal';
import { t } from '../../../../strings';

export const LocationDisclosureModal = (props: ModalProps) => {
  // context
  const navigation = useNavigation();
  // state
  const [permission, askPermission, getPermission] = usePermissions(LOCATION);
  // side effects
  // update permission when window is focused
  React.useEffect(() => {
    navigation.addListener('focus', getPermission);
    return () => navigation.removeListener('focus', getPermission);
  }, [navigation, getPermission]);
  // UI
  return (
    <DefaultModal
      header={t('Compartilhamento da localização')}
      body={t(
        'O AppJusto coleta a localização somente quando você estiver disponível, para permitir o envio de corridas mais próximas e o acompanhamento das entregas. Isso também pode ocorrer com o aplicativo fechado ou sem uso no momento.'
      )}
      dismissButtonTitle={t('Ok, entendi')}
      visible={permission && permission.status !== 'granted'}
      onDismiss={() => {
        if (permission?.status === 'denied') {
          Linking.openSettings();
        } else {
          askPermission();
        }
      }}
      {...props}
    />
  );
};
