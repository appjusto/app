import { useNavigation } from '@react-navigation/core';
import { LOCATION, usePermissions } from 'expo-permissions';
import React from 'react';
import { BackHandler, Linking, ModalProps, Platform } from 'react-native';
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
    if (!accepted) {
      setAccepted(true);
      if (permission.canAskAgain) {
        askPermission();
      } else {
        Linking.openSettings();
      }
    } else {
      BackHandler.exitApp();
    }
  };
  // UI
  const header = !accepted ? t('Compartilhamento da localização') : t('Reinicie o aplicativo');
  const message = !accepted
    ? t(
        'Você precisa permitir que o AppJusto saiba sua localização o tempo todo para que possamos enviar corridas próximas à você e acompanhar as entregas. Isso também pode ocorrer com o aplicativo fechado ou sem uso no momento. Nós só coletamos e utilizamos sua localização caso você esteja disponível para aceitar corridas.'
      )
    : t(
        'Você precisa fechar o aplicativo para que as alterações de localização sejam aplicadas. Por favor, reabra o app após o fechamento.'
      );
  const buttonTitle =
    !accepted || Platform.OS === 'ios' ? t('Ok, entendi') : t('Fechar aplicativo');
  return (
    <DefaultModal
      header={header}
      body={message}
      dismissButtonTitle={buttonTitle}
      visible={!permission.granted}
      onDismiss={modalHandler}
      {...props}
    />
  );
};
