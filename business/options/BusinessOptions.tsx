import React from 'react';
import { ScrollView } from 'react-native';
import { ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import { useSegmentScreen } from '../../common/store/api/track';
import { screens } from '../../common/styles';
import { confirmLogout } from '../../common/utils/utils';
import { t } from '../../strings';

// TODO: add the correct screenNavigationProp

export const BusinessOptions = () => {
  // context
  const api = React.useContext(ApiContext);
  // side effects
  // tracking
  useSegmentScreen('BusinessOptions');
  return (
    <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        <ConfigItem
          title={t('Horários')}
          subtitle={t('Defina o horário de funcionamento')}
          onPress={() => null}
        />
        <ConfigItem
          title={t('Área de entrega')}
          subtitle={t('Defina o raio de entrega')}
          onPress={() => null}
        />
        <ConfigItem
          title={t('Histórico de pedidos')}
          subtitle={t('Veja os pedidos realizados')}
          onPress={() => null}
        />
        <ConfigItem
          title={t('Perfil do restaurante')}
          subtitle={t('Edite os dados do seu restaurante')}
          onPress={() => null}
        />
        <ConfigItem
          title={t('Sair do App')}
          subtitle={t(
            'Desconecte-se do aplicativo. Para retornar, você precisará confirmar seu e-mail cadastrado'
          )}
          bottomBorder={false}
          onPress={() => confirmLogout(api)}
        />
      </PaddedView>
    </ScrollView>
  );
};
