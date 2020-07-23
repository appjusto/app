import React, { useState } from 'react';
import { View, Text } from 'react-native';

import DefaultButton from '../../common/DefaultButton';
import CheckField from '../../common/CheckField';
import { t } from '../../../strings';
import { colors, texts, screens } from '../../common/styles';
import { checkboxActive, checkboxInactive } from '../../../assets/icons';

const EraseConfirmed = ({ navigation }) => {
  const [region, setRegion] = useState(false);
  const toogleRegion = () => setRegion(!region);
  const [need, setNeed] = useState(false);
  const toogleNeed = () => setNeed(!need);
  const [prices, setPrices] = useState(false);
  const tooglePrices = () => setPrices(!prices);
  const [app, setApp] = useState(false);
  const toogleApp = () => setApp(!app);
  const [safe, setSafe] = useState(false);
  const toogleSafe = () => setSafe(!safe);
  const [other, setOther] = useState(false);
  const toogleOther = () => setOther(!other);
  return (
    <View style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.big, marginTop: 16, width: '80%' }}>
        {t('Sua conta foi excluída com sucesso.')}
      </Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Obrigado por fazer parte do AppJusto. Antes de ir embora, conta pra gente o que motivou você a excluir sua conta?'
        )}
      </Text>
      <View style={{ marginTop: 24, flex: 1 }}>
        <CheckField
          source={region ? checkboxActive : checkboxInactive}
          text={t('Não atende na minha região')}
          onPress={toogleRegion}
        />
        <CheckField
          source={need ? checkboxActive : checkboxInactive}
          marginTop={12}
          text={t('Não encontrei o que preciso')}
          onPress={toogleNeed}
        />
        <CheckField
          marginTop={12}
          source={prices ? checkboxActive : checkboxInactive}
          text={t('Preços mais altos que os concorrentes')}
          onPress={tooglePrices}
        />
        <CheckField
          marginTop={12}
          source={app ? checkboxActive : checkboxInactive}
          text={t('Não gostei do aplicativo')}
          onPress={toogleApp}
        />
        <CheckField
          marginTop={12}
          source={safe ? checkboxActive : checkboxInactive}
          text={t('Não me senti seguro')}
          onPress={toogleSafe}
        />
        <CheckField
          marginTop={12}
          source={other ? checkboxActive : checkboxInactive}
          text={t('Prefiro usar outro serviço ou aplicativo')}
          onPress={toogleOther}
        />
        <View style={{ flex: 1 }} />
        <DefaultButton
          style={{ width: '100%', marginBottom: 16 }}
          title={t('Voltar para a tela inicial')}
          onPress={() => navigation.navigate('ConsumerHome')}
        />
      </View>
    </View>
  );
};

export default EraseConfirmed;
