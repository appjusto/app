import React, { useState } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { circle, circleActive } from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { borders, colors, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';

export default function () {
  const [reason, setReason] = useState(null);
  return (
    <PaddedView style={{ ...screens.configScreen }}>
      <Text style={{ ...texts.big, marginBottom: 24 }}>{t('Por que você recusou o pedido?')}</Text>
      <TouchableOpacity onPress={() => setReason('busy')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Image source={reason === 'busy' ? circleActive : circle} />
          <Text style={{ ...texts.small, marginLeft: 12 }}>{t('Estou ocupado')}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setReason('low fee')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Image source={reason === 'low fee' ? circleActive : circle} />
          <Text style={{ ...texts.small, marginLeft: 12 }}>
            {t('O valor estava abaixo do esperado')}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setReason('too far')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Image source={reason === 'too far' ? circleActive : circle} />
          <Text style={{ ...texts.small, marginLeft: 12 }}>
            {t('Muito distante da retirada ou entrega')}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setReason('not safe')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Image source={reason === 'not safe' ? circleActive : circle} />
          <Text style={{ ...texts.small, marginLeft: 12 }}>{t('Não me senti seguro')}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setReason('forgot status')}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={reason === 'forgot status' ? circleActive : circle} />
          <Text style={{ ...texts.small, marginLeft: 12 }}>
            {t('Esqueci de desativar meu status')}
          </Text>
        </View>
      </TouchableOpacity>
      <Text style={{ ...texts.default, marginBottom: 8, marginTop: 34 }}>
        {t(
          'Você pode usar o espaço abaixo para detalhar mais sua recusa, dessa forma conseguiremos melhorar nossos serviços:'
        )}
      </Text>
      <TextInput
        placeholder={t('Escreva sua mensagem')}
        style={{ width: '100%', height: 128, ...borders.default, borderColor: colors.grey }}
      />
      <View style={{ flex: 1 }} />
      <DefaultButton title={t('Enviar')} disabled={!reason} />
    </PaddedView>
  );
}
