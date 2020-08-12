import React, { useRef, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
// import { useSelector } from 'react-redux';

import { t } from '../../strings';
import AvoidingView from '../common/AvoidingView';
// import { getFlavor } from '../../store/config/selectors';
// import { getConsumer } from '../../store/consumer/selectors';
// import { getCourier } from '../../store/courier/selectors';
// import Consumer from '../../store/consumer/types/Consumer';
// import Courier from '../../store/courier/types/Courier';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import LabeledText from '../common/LabeledText';
import { texts, screens, padding, colors } from '../common/styles';

export default function ({ navigation }) {
  //state
  // const flavor = useSelector(getFlavor);
  // const courier = useSelector(getCourier);
  // const consumer = useSelector(getConsumer);
  // const user: Consumer | Courier | undefined = flavor === 'consumer' ? consumer : courier;
  const [bank, setBank] = useState<string>('');
  const [agency, setAgency] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [digit, setDigit] = useState<string>('');
  //refs
  const scrollViewRef = useRef<ScrollView>(null);
  //UI
  return (
    <View style={{ ...screens.configScreen, paddingHorizontal: padding }}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flex: 1 }}>
        <AvoidingView style={{ flex: 1 }}>
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
                  {t('Nome do seu banco')}
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
