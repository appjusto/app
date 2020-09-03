import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';

import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../../common/components/texts/LabeledText';
import AvoidingView from '../../../../common/components/views/AvoidingView';
import { ProfileParamList } from '../../../../common/screens/profile/types';
import { texts, screens, padding, colors } from '../../../../common/styles';
import { t } from '../../../../strings';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileBank'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileBank'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // state
  const [bank, setBank] = useState<null | { bankId: string; bankName: string }>(null);
  const [agency, setAgency] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [digit, setDigit] = useState<string>('');
  // refs
  const scrollViewRef = useRef<ScrollView>(null);

  // side effects
  useEffect(() => {
    const { bank } = route.params ?? {};
    if (bank) setBank(bank);
  }, [route.params]);

  // UI
  return (
    <View style={{ ...screens.configScreen, paddingHorizontal: padding }}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flex: 1 }}>
        <AvoidingView>
          <Text style={{ ...texts.big, marginTop: 16 }}>{t('Dados bancários')}</Text>
          <Text style={{ ...texts.default, marginTop: 8, color: colors.darkGrey }}>
            {t('A conta precisa estar no seu CPF. Não serão aceitas contas de terceiros.')}
          </Text>
          <View style={{ marginTop: 24 }}>
            {/* <DefaultInput title={t('Banco')} value={bank} onChangeText={(text) => setBank(text)} /> */}
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('SelectBank');
              }}
            >
              <View>
                <LabeledText style={{ marginTop: padding }} title={t('Banco')}>
                  {bank?.bankName ?? t('Nome do seu banco')}
                </LabeledText>
              </View>
            </TouchableWithoutFeedback>
            <DefaultInput
              style={{ marginTop: 16 }}
              title={t('Agência')}
              value={agency}
              onChangeText={(text) => setAgency(text)}
            />
            <View style={{ marginTop: 16, justifyContent: 'space-between' }}>
              <DefaultInput
                title={t('Conta')}
                value={account}
                onChangeText={(text) => setAccount(text)}
              />
              <DefaultInput
                style={{ marginTop: 16 }}
                title={t('Dígito')}
                value={digit}
                onChangeText={(text) => setDigit(text)}
              />
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <DefaultButton style={{ marginBottom: 32 }} title={t('Avançar')} onPress={() => {}} />
        </AvoidingView>
      </ScrollView>
    </View>
  );
}
