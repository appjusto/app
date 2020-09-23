import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';

export default function () {
  //"placeholders"
  const fee = '10,50';
  const tip = '3,00';
  // fake data for Flatlists
  const dataOne = [
    { title: 'Sim, tudo certo', key: '1' },
    { title: 'Não, negaram água', key: '2' },
    { title: 'Não, negaram banheiro', key: '3' },
  ];
  const dataTwo = [
    { title: 'Sim, tudo certo', key: '1' },
    { title: 'Não, longa espera', key: '2' },
    { title: 'Não, cliente não apareceu', key: '3' },
  ];

  const styles = StyleSheet.create({
    feedbackBox: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: colors.grey,
      borderRadius: 6,
      height: 40,
      marginRight: 4,
    },
  });
  return (
    <PaddedView style={{ ...screens.default }}>
      <View style={{ paddingTop: 24, alignItems: 'center' }}>
        <Image source={icons.motocycle} />
        <Text style={{ ...texts.big, marginVertical: 16 }}>{t('Corrida finalizada!')}</Text>
        <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Valor recebido')}</Text>
        <Text style={{ ...texts.big, marginTop: 4 }}>
          R$ {fee} <Text style={{ color: colors.darkGreen }}>+ R$ {tip} de gorjeta</Text>
        </Text>
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ ...texts.default, marginBottom: 16 }}>
          {t('Tudo certo no restaurante?')}
        </Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={dataOne}
          renderItem={({ item }) => (
            <TouchableOpacity key={item.key}>
              <View style={styles.feedbackBox}>
                <Text>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ ...texts.default, marginBottom: 16 }}>{t('Tudo certo no cliente?')}</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={dataTwo}
          renderItem={({ item }) => (
            <TouchableOpacity key={item.key}>
              <View style={styles.feedbackBox}>
                <Text>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton title={t('Finalizar')} />
    </PaddedView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> sdk39-upgrade
