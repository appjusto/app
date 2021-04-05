import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import useBanks from '../../../../../common/store/api/platform/hooks/useBanks';
import { screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'SelectBank'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'SelectBank'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // screen state
  const banks = useBanks();
  const [bankSearch, setBankSearch] = React.useState('');
  const filteredBanks = React.useMemo(() => {
    if (!banks) return [];
    return banks.filter(
      (bank) =>
        bank.name.toLowerCase().indexOf(bankSearch.toLowerCase()) !== -1 ||
        bank.code.indexOf(bankSearch) !== -1
    );
  }, [banks, bankSearch]);
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
        autoCapitalize="words"
      />
      <FlatList
        data={filteredBanks}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileBank', { bank: item });
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 60,
                }}
              >
                <Text style={{ ...texts.md }}>{`${item.code} - ${item.name}`}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </PaddedView>
  );
}
