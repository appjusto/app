import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bank } from 'appjusto-types';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import useBanks from '../../../../../common/store/api/platform/hooks/useBanks';
import { padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { BankParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<BankParamList, 'SelectBank'>;
type ScreenRouteProp = RouteProp<BankParamList, 'SelectBank'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // screen state
  const banks = useBanks();
  const [selectedBank, setSelectedBank] = useState<null | Bank>(null);
  const [bankSearch, setBankSearch] = useState('');
  const filteredBanks = useMemo(() => {
    if (!banks) return [];
    return banks.filter(
      (bank) => bank.name.indexOf(bankSearch) !== -1 || bank.id.indexOf(bankSearch) !== -1
    );
  }, [banks, bankSearch]);

  // handlers
  const selectBankHandler = useCallback(() => {
    if (!selectedBank) return;
    navigation.navigate('ProfileBank', { bank: selectedBank });
  }, [selectedBank]);
  // UI
  return (
    <PaddedView style={{ ...screens.lightGrey }}>
      <DefaultInput
        // defaultValue={initialAddress}
        value={bankSearch}
        title={t('Banco')}
        placeholder={t('Nome do seu banco')}
        onChangeText={setBankSearch}
        style={{ marginBottom: 32 }}
      />
      <FlatList
        data={filteredBanks}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedBank(item);
                setBankSearch(item.name);
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 60,
                }}
              >
                <Text style={{ ...texts.medium }}>{`${item.name} - ${item.id}`}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />
      <DefaultButton
        style={{ marginTop: padding }}
        title={t('Confirmar banco')}
        disabled={!selectedBank}
        activityIndicator={!banks}
        onPress={selectBankHandler}
      />
    </PaddedView>
  );
}
