import { Alert } from 'react-native';
import { t } from '../../strings';
import Api from '../store/api/api';
import { track } from '../store/api/track';

export const confirmLogout = (api: Api): void => {
  Alert.alert(
    t('Sair da conta'),
    t(
      'Sua conta não será excluída mas você precisará fazer login novamente para continuar usando o App.'
    ),
    [
      {
        text: t('Cancelar'),
        style: 'cancel',
      },
      {
        text: t('Confirmar'),
        style: 'destructive',
        onPress: () => {
          track('signing out');
          api.signOut();
        },
      },
    ]
  );
};
