import Slider from '@react-native-community/slider';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { slider } from '../../../assets/icons';
import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import DefaultInput from '../../common/DefaultInput';
import { texts, screens, colors, borders } from '../../common/styles';
import PaddedView from '../../common/views/PaddedView';

export default function () {
  // state
  const [fare, setFare] = useState(0);
  // try an effect to save the value everytime it changes
  const fareHandler = useEffect(() => {
    return setFare(fare);
  }, [fare]);
  return (
    <PaddedView style={{ ...screens.configScreen }}>
      <Text style={{ ...texts.big }}>{t('Criar uma nova frota')}</Text>
      <Text style={{ ...texts.default, marginTop: 8, color: colors.darkGrey }}>
        {t('Preencha as informações da sua frota')}
      </Text>
      <DefaultInput
        title={t('Nome da frota')}
        placeholder={t('Nome da frota')}
        style={{ marginTop: 32 }}
      />
      <DefaultInput
        title={t('Descrição')}
        placeholder={t('Descreva sua frota em até 140 caracteres')}
        style={{ marginTop: 12, height: 126 }}
      />
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 64 }}>
          <Text style={{ ...texts.medium }}>{t('Defina o valor inicial da corrida: ')}</Text>
          <View style={styles.fareDisplay}>
            <Text style={{ ...texts.default }}>R$ {fare}</Text>
          </View>
        </View>
        <Slider
          style={{ width: '100%', height: 40, marginTop: 12 }}
          minimumValue={0}
          maximumValue={20}
          // step={200}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
          thumbImage={slider}
          value={fare}
          onValueChange={fareHandler}
          // onSlidingComplete={() => setFare(fare)}
        />
        <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('min: R$ 0')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('máx: R$ 20')}</Text>
        </View>
      </View>
      <View style={{ marginTop: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...texts.medium }}>{t('Defina o valor por km: ')}</Text>
          <View style={[styles.fareDisplay, { width: 112 }]}>
            <Text style={{ ...texts.default }}>R$ 1,00 por km</Text>
          </View>
        </View>
        <Slider
          style={{ width: '100%', height: 40, marginTop: 12 }}
          minimumValue={0}
          maximumValue={20}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
          thumbImage={slider}
          onValueChange={() => {}}
          onSlidingComplete={() => {}}
        />
        <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('min: R$ 0')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('máx: R$ 10')}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton style={{ marginVertical: 32 }} title={t('Confirmar')} onPress={() => {}} />
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  fareDisplay: {
    ...borders.default,
    borderRadius: 32,
    height: 32,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
