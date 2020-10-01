import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bank } from 'appjusto-types';
import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import { fetchBanks } from '../../../../../common/store/courier/actions';
import { getBanks } from '../../../../../common/store/courier/selectors';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { texts, screens, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { BankParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<BankParamList, 'SelectBank'>;
type ScreenRouteProp = RouteProp<BankParamList, 'SelectBank'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const busy = useSelector(getUIBusy);
  const banks = useSelector(getBanks);

  // screen state
  const [bank, setBank] = useState<null | Bank>(null);
  const [bankSearch, setBankSearch] = useState('');
  const filteredBanks = useMemo(() => {
    if (!banks) return [];
    return banks.filter(
      (bank) => bank.name.indexOf(bankSearch) !== -1 || bank.id.indexOf(bankSearch) !== -1
    );
  }, [banks, bankSearch]);

  // effects
  useEffect(() => {
    // fetch banks if not fetched previously
    if (banks === undefined) {
      dispatch(fetchBanks(api));
    }
  }, [banks]);

  // handlers
  const selectBankHandler = useCallback(() => {
    if (!bank) return;
    navigation.navigate('ProfileBank', { bank });
  }, [bank]);
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
                setBank(item);
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
        disabled={!bank}
        activityIndicator={busy}
        onPress={selectBankHandler}
      />
    </PaddedView>
  );
}
