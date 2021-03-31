import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import CheckField from '../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import HR from '../../../../common/components/views/HR';
import { getCourier } from '../../../../common/store/courier/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { BankData } from './BankData';
import { PaymentNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<PaymentNavigatorParamList, 'Payment'>;
type ScreenRoute = RouteProp<PaymentNavigatorParamList, 'Payment'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const Payment = ({ navigation, route }: Props) => {
  // params
  const { operation } = route.params;
  // redux
  const courier = useSelector(getCourier)!;
  // screen state
  const [agreed, setAgreed] = React.useState(false);

  if (!courier)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  return operation === 'withdraw' ? (
    <ScrollView style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.xl }}>{t('Disponível para saque')}</Text>
        <Text style={{ ...texts.md, color: colors.grey700, marginTop: padding }}>
          {t('Será descontando somente o valor da tarifa para a transferência.')}
        </Text>
      </PaddedView>
      <HR height={padding} color={colors.grey90} />
      <View style={{ paddingTop: halfPadding }}>
        <SingleHeader title={t('Entenda os valores')} />
        <Text
          style={{ ...texts.xs, color: colors.grey700, paddingHorizontal: padding, paddingTop: 12 }}
        >
          {t('Veja o resumo da sua transferência')}
        </Text>
        <PaddedView>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ ...texts.sm }}>{t('Disponível para saque')}</Text>
            <Text style={{ ...texts.sm }}>{t('R$ XXXX,00')}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 2,
            }}
          >
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Tarifa de transferência')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.red }}>{t('-R$ X,00')}</Text>
          </View>
        </PaddedView>
      </View>
      <HR height={padding} color={colors.grey90} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: padding,
          paddingVertical: halfPadding,
        }}
      >
        <SingleHeader title={t('Você irá receber')} />
        <Text style={{ ...texts.xl }}>{t('R$ XXXX,00')}</Text>
      </View>
      <HR height={padding} color={colors.grey90} />
      <View style={{ paddingTop: halfPadding }}>
        <BankData
          courier={courier}
          navigateToProfileBank={() => navigation.navigate('ProfileBank')}
        />
        <HR height={padding} color={colors.grey90} />
        <PaddedView>
          <DefaultButton
            title={t('Solicitar transferência')}
            style={{ marginTop: 24 }}
            onPress={() => navigation.navigate('PaymentRequestedFeedback')}
          />
        </PaddedView>
      </View>
    </ScrollView>
  ) : (
    <ScrollView style={{ ...screens.default }}>
      <PaddedView>
        <Text style={{ ...texts.xl }}>{t('Taxa de adiantamento')}</Text>
        <Text style={{ ...texts.md, color: colors.grey700, marginTop: padding }}>
          <Text style={{ color: colors.red }}>{t('Atenção: ')}</Text>
          {t(
            'para realizar o adiantamento será cobrada uma taxa de 2,5% sobre o valor ainda não compensado.'
          )}
        </Text>
      </PaddedView>
      <HR height={padding} color={colors.grey90} />
      <View style={{ paddingTop: halfPadding }}>
        <SingleHeader title={t('Entenda os valores')} />
        <Text
          style={{ ...texts.xs, color: colors.grey700, paddingHorizontal: padding, paddingTop: 12 }}
        >
          {t('Veja os descontos do seu adiantamento')}
        </Text>
        <PaddedView>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ ...texts.sm }}>{t('Disponível para saque')}</Text>
            <Text style={{ ...texts.sm }}>{t('R$ XXXX,00')}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 2,
            }}
          >
            <Text style={{ ...texts.sm }}>{t('Valor para adiantamento')}</Text>
            <Text style={{ ...texts.sm }}>{t('R$ XXX,00')}</Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Taxa de adiantamento (2,5%')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.red }}>{t('-R$ X,XX')}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 2,
            }}
          >
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Tarifa de transferência')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.red }}>{t('-R$ X,00')}</Text>
          </View>
        </PaddedView>
      </View>
      <HR height={padding} color={colors.grey90} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: padding,
          paddingVertical: halfPadding,
        }}
      >
        <SingleHeader title={t('Total com descontos')} />
        <Text style={{ ...texts.xl }}>{t('R$ XXXX,XX')}</Text>
      </View>
      <HR height={padding} color={colors.grey90} />
      <View style={{ paddingTop: halfPadding }}>
        <BankData
          courier={courier}
          navigateToProfileBank={() => navigation.navigate('ProfileBank')}
        />
        <HR height={padding} color={colors.grey90} />
        <PaddedView>
          <CheckField
            text={t('Estou ciente do valor descontado')}
            onPress={() => setAgreed(!agreed)}
            checked={agreed}
          />
          <DefaultButton
            title={t('Solicitar transferência com adiantamento')}
            style={{ marginTop: 24 }}
            onPress={() => navigation.navigate('PaymentRequestedFeedback')}
            disabled={!agreed}
          />
        </PaddedView>
      </View>
    </ScrollView>
  );
};
