import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import DefaultInput from '../../common/DefaultInput';
import { texts, screens, colors } from '../../common/styles';
import FleetCard from './FleetCard';

const FLEETS = [
  {
    name: 'Frota AppJusto',
    participants: '16 participantes',
    description:
      'Descritivo da frota em até 140 caracteres. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem at arcu consectetu.',
  },
  {
    name: 'Frota Zona Norte',
    participants: '14 participantes',
    description:
      'Descritivo da frota em até 140 caracteres. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem at arcu consectetu.',
  },
  {
    name: 'Frota Zona Sul',
    participants: '8 participantes',
    description:
      'Descritivo da frota em até 140 caracteres. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem at arcu consectetu.',
  },
];

export default function ({ navigation }) {
  //UI
  return (
    <View style={{ ...screens.configScreen, paddingVertical: 16, paddingHorizontal: 16 }}>
      <FlatList
        data={FLEETS}
        renderItem={({ item }) => {
          return (
            <FleetCard
              name={item.name}
              participants={item.participants}
              description={item.description}
              onButtonPress={() => {}}
            />
          );
        }}
        keyExtractor={(item) => item.participants}
        ListHeaderComponent={
          <>
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
          </>
        }
        ListFooterComponent={
          <DefaultButton
            style={{ marginVertical: 32 }}
            title={t('Criar uma nova frota')}
            onPress={() => navigation.navigate('CreateFleet')}
          />
        }
      />
    </View>
  );
}
