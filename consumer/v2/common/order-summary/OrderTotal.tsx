import React from 'react';
import { Switch, Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import {
  cpfFormatter,
  cpfMask,
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import Pill from '../../../../common/components/views/Pill';
import { colors, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

interface Props {
  total: number;
  switchValue: boolean;
  onSwitchValueChange?: (value: boolean) => void;
  cpf: string;
  setCpf: (value: string) => void;
}

export const OrderTotal = ({ total, switchValue, onSwitchValueChange, cpf, setCpf }: Props) => {
  return (
    <View style={{ paddingTop: padding, flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pill />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 12,
            flex: 1,
          }}
        >
          <Text style={{ ...texts.md, ...texts.bold }}>{t('Valor total a pagar')}</Text>
          <Text style={{ ...texts.xl }}>{formatCurrency(total)}</Text>
        </View>
      </View>
      <Text
        style={{
          marginTop: padding,
          ...texts.xs,
          color: colors.grey700,
          paddingHorizontal: padding,
        }}
      >
        {t(
          'Você poderá deixar uma Caixinha de gorjeta para o/a entregador/a quando o seu pedido for entregue.'
        )}
      </Text>
      <PaddedView
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white }}
      >
        <Switch
          trackColor={{ false: colors.grey500, true: colors.white }}
          thumbColor={switchValue ? colors.green500 : colors.yellow}
          ios_backgroundColor={colors.white}
          onValueChange={onSwitchValueChange}
          value={switchValue}
        />

        <Text style={{ ...texts.sm, marginLeft: padding }}>{t('Adicionar CPF na nota')}</Text>
      </PaddedView>
      {switchValue && (
        <View style={{ marginHorizontal: padding, marginBottom: padding }}>
          <PatternInput
            style={{ marginTop: padding }}
            title={t('CPF')}
            value={cpf}
            placeholder={t('Seu CPF, apenas números')}
            mask={cpfMask}
            parser={numbersOnlyParser}
            formatter={cpfFormatter}
            keyboardType="number-pad"
            returnKeyType="default"
            blurOnSubmit
            onChangeText={(value) => setCpf(value)}
          />
        </View>
      )}
    </View>
  );
};
