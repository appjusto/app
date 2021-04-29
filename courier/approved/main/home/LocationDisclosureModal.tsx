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
  const [accepted, setAccepted] = React.useState(false);
  const [permission, askPermission, getPermission] = usePermissions(LOCATION);
  // side effects
  // update permission when window is focused
  React.useEffect(() => {
    navigation.addListener('focus', getPermission);
    return () => navigation.removeListener('focus', getPermission);
  }, [navigation, getPermission]);
  if (!permission) return null;
  // handlers
  const modalHandler = () => {
    setAccepted(true);
    if (permission.canAskAgain) {
      askPermission();
    } else {
      Linking.openSettings();
    }
  };
  // UI
  const message = !accepted
    ? t(
        'Você precisa permitir que o AppJusto saiba sua localização o tempo todo para que possamos enviar corridas próximas à você e acompanhar as entregas. Isso também pode ocorrer com o aplicativo fechado ou sem uso no momento. Nós só coletamos e utilizamos sua localização caso você esteja disponível para aceitar corridas.'
      )
    : t('Feche e reabra o App para que as permissões sejam atualizadas.');
  return (
    <DefaultModal
      header={t('Compartilhamento da localização')}
      body={message}
      dismissButtonTitle={t('Ok, entendi')}
      visible={!permission.granted}
      onDismiss={modalHandler}
      {...props}
    />
  );
};
