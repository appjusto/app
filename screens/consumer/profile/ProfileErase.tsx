import React from 'react';
import { View, Text } from 'react-native';

import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import { colors, texts, screens } from '../../common/styles';

const ProfileErase = ({ navigation }) => {
  return (
    <View style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.big, marginTop: 16 }}>
        {t('Tem certeza que deseja excluir sua conta?')}
      </Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Todos os seus dados serão apagados do nosso sistema, juntamente com seu histórico de pedidos, e você terá que criar um novo cadastro para usar o AppJusto.'
        )}
      </Text>
      <View style={{ flex: 1 }} />
      <View>
        <DefaultButton
          styleObject={{ width: '100%', marginBottom: 8 }}
          title={t('Manter minha conta')}
        />
        <DefaultButton
          disabled
          title={t('Tenho certeza, pode excluir')}
          styleObject={{ marginBottom: 16 }}
          onPress={() => {
            navigation.navigate('EraseConfirmed');
          }}
        />
      </View>
    </View>
  );
};

export default ProfileErase;
