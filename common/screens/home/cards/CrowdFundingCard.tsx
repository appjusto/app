import * as Linking from 'expo-linking';
import React from 'react';
import { Image, Text, View } from 'react-native';
import * as icons from '../../../../assets/icons';
import { t } from '../../../../strings';
import { AppJustoLanding } from '../../../../strings/values';
import DefaultButton from '../../../components/buttons/DefaultButton';
import PaddedView from '../../../components/containers/PaddedView';
import { borders, colors, padding, texts } from '../../../styles';

export const CrowdFundingCard = () => {
  return (
    <PaddedView style={{ ...borders.default, backgroundColor: colors.green700 }}>
      <View
        style={{ flexDirection: 'row', marginBottom: padding, justifyContent: 'space-between' }}
      >
        <View style={{ width: '65%' }}>
          <Text style={{ ...texts.sm, color: colors.darkYellow }}>
            {t('Já pensou em ser dono do App? Agora você pode!')}
          </Text>
          <Text style={{ ...texts.xs, color: colors.white, marginTop: 4 }}>
            {t(
              'Participe do investimento coletivo a partir de R$ 100 e seja também um dono do AppJusto'
            )}
          </Text>
        </View>
        <View style={{ height: 80, width: 80 }}>
          <Image source={icons.crowdFunding} height={80} width={80} />
        </View>
      </View>
      <DefaultButton
        title={t('Saiba mais sobre o investimento')}
        onPress={() => Linking.openURL(AppJustoLanding)}
      />
    </PaddedView>
  );
};
