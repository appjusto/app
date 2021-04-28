import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { t } from '../../../strings';
import ConfigItem from '../../components/views/ConfigItem';
import { screens } from '../../styles';

export const AboutApp = () => {
  return (
    <ScrollView style={{ ...screens.config }}>
      <ConfigItem
        title={t('Central de ajuda')}
        subtitle={t('Tire suas dúvidas')}
        onPress={() => null}
      />
      <ConfigItem
        title={t('Site oficial')}
        subtitle={t('Acesse nosso site')}
        onPress={() => null}
      />
      <ConfigItem
        title={t('Código aberto')}
        subtitle={t('Acesse o repositório com o código no GitHub')}
        onPress={() => null}
      />
    </ScrollView>
  );
};
