import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { t } from '../../strings';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import { borders, texts, screens, colors } from '../common/styles';
import { BANKS } from './banks';

export default function () {
  //state
  const [bank, setBank] = useState('');
  //UI
  return (
    <View style={{ ...screens.lightGrey, paddingTop: 16 }}>
      <DefaultInput
        // defaultValue={initialAddress}
        value={bank}
        title={t('Banco')}
        placeholder={t('Nome do seu banco')}
        onChangeText={(text) => setBank(text)}
        style={{ marginBottom: 32 }}
      />
      <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: 14 }}>
        {t('Últimos endereços utilizados')}
      </Text>
      <FlatList
        data={BANKS}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => setBank(item.label)}>
              <View style={styles.item}>
                <Text style={{ ...texts.medium }}>{item.label}</Text>
                <Text style={{ ...texts.medium }}> - {item.value}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.value}
      />
      <DefaultButton style={{ marginBottom: 16 }} title={t('Confirmar banco')} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    ...borders.default,
    justifyContent: 'space-between',
  },
});
