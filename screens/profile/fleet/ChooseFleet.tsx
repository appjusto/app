import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import DefaultInput from '../../common/DefaultInput';
import FleetCard from './FleetCard';
import { borders, texts, screens, colors } from '../../common/styles';

export default function () {
  //UI
  return (
    <ScrollView style={{ ...screens.configScreen, paddingVertical: 16, paddingHorizontal: 16 }}>
      <Text style={{ ...texts.big }}>{t('Cidade de atuação')}</Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t('Escolha a cidade que você vai fazer suas entregas')}
      </Text>
      <DefaultInput
        title={t('Cidades disponíveis')}
        placeholder={t('São Paulo')}
        style={{ marginTop: 16 }}
      />
      <DefaultButton
        style={{ marginTop: 8 }}
        title={t('Minha cidade não está disponível')}
        onPress={() => {}}
        disabled
      />
      <Text style={{ ...texts.big, marginTop: 16 }}>{t('Escolha sua frota')}</Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Faça parte de uma frota existente ou crie sua própria frota. Frotas com mais participantes tem mais chances de corridas melhores.'
        )}
      </Text>
      <Text style={{ ...texts.default, marginTop: 24 }}>
        {t('Principais frotas nessa cidade:')}
      </Text>
      <FleetCard
        name={t('Frota AppJusto')}
        participants={t('16 participantes')}
        description={t(
          'Descritivo da frota em até 140 caracteres. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem at arcu consectetu.'
        )}
      />
    </ScrollView>
  );
}
