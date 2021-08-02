import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Linking, ModalProps } from 'react-native';
import { DefaultModal } from '../../../../common/components/views/DefaultModal';
import { useLocationPermission } from '../../../../common/location/useLocationPermission';
import { t } from '../../../../strings';

export const LocationDisclosureModal = (props: ModalProps) => {
  // context
  const navigation = useNavigation();
  // state
  const {
    status: foregroundStatus,
    get: getForeground,
  } = useLocationPermission('foreground', true);
  const {
    status: backgroundStatus,
    request: requestBackground,
    get: getBackground,
  } = useLocationPermission('background');
  // side effects
  // update permission when window is focused
  React.useEffect(() => {
    const focusHandler = () => {
      if (foregroundStatus !== 'granted') {
        getForeground();
      } else if (backgroundStatus !== 'granted') {
        getBackground();
      }
    };
    navigation.addListener('focus', focusHandler);
    return () => navigation.removeListener('focus', focusHandler);
  }, [backgroundStatus, foregroundStatus, navigation, getBackground, getForeground]);
  // handlers
  const modalHandler = () => {
    if (foregroundStatus === 'granted') {
      requestBackground();
    } else {
      Linking.openSettings();
    }
  };
  console.log('foregroundStatus', foregroundStatus);
  console.log('backgroundStatus', backgroundStatus);
  // UI
  return (
    <DefaultModal
      header={t('Compartilhar localização.')}
      body={t(
        'Você precisa permitir que o AppJusto saiba sua localização o tempo todo para que possamos enviar corridas próximas à você e acompanhar as entregas. Isso também pode ocorrer com o aplicativo fechado ou sem uso no momento. Nós só coletamos e utilizamos sua localização caso você esteja disponível para aceitar corridas.'
      )}
      dismissButtonTitle={t('Ok, entendi')}
      onDismiss={modalHandler}
      {...props}
    />
  );
};
