import { Fee, Order } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatCurrency, formatDate } from '../../../common/utils/formatters';
import { usePlatformFees } from '../../../common/utils/platform/usePlatformFees';
import { t } from '../../../strings';

type Props = {
  order: Order;
  tip: number;
  onChange: (value: number) => void;
  isLoading?: boolean;
  onConfirm?: () => void;
  tipSent?: boolean;
};

const calculateValue = (value: number, { fixed, percent }: Fee) =>
  Math.floor((value + fixed) / (1 - percent / 100));

const getTipValues = (fee: Fee): HorizontalSelectItem[] => {
  return [0, 3, 5, 8, 10, 30].map((value) => {
    const cents = calculateValue(value * 100, fee);
    return {
      id: `${value}`,
      title: !value ? t('Sem caixinha') : formatCurrency(cents),
      data: cents,
    };
  });
};

export default function ({ order, tip, isLoading = false, onChange, onConfirm, tipSent }: Props) {
  const alreadyTipped = Boolean(order.tip?.value);
  const fees = usePlatformFees()?.fees?.processing?.iugu?.credit_card ?? {
    fixed: 9,
    percent: 2.42,
  };
  const data = getTipValues(fees);
  const selectedtip =
    data.find((item) => {
      if (!order.tip?.value) return item.data === tip;
      return order.tip.value === item.data || calculateValue(order.tip.value, fees) === item.data;
    }) ?? data[0];
  // UI
  return (
    <View>
      {order.paymentMethod !== 'pix' ? (
        <View style={{ paddingHorizontal: padding, paddingTop: padding }}>
          <View>
            <View>
              <Text style={{ ...texts.xl, ...texts.bold }}>{t('Caixinha')}</Text>
              <Text style={{ ...texts.md, color: colors.grey700, flexWrap: 'wrap' }}>
                {t('Valorize ainda mais o trabalho do/a entregador/a')}
              </Text>
            </View>
            <View style={{ paddingBottom: padding }}>
              <View style={{ flexDirection: 'row', paddingBottom: padding, marginTop: 24 }}>
                <RoundedProfileImg flavor="courier" id={order.courier?.id} size={64} />
                {order.courier?.joined && (
                  <View style={{ marginLeft: halfPadding }}>
                    <Text style={[texts.sm]}>{order.courier?.name}</Text>
                    <Text style={{ ...texts.xs, color: colors.grey700 }}>
                      {t('No AppJusto desde')}
                    </Text>
                    <Text style={{ ...texts.xs }}>
                      {formatDate(order.courier?.joined, 'monthYear')}
                    </Text>
                  </View>
                )}
              </View>
              <HorizontalSelect
                disabled={alreadyTipped}
                data={data}
                selected={selectedtip}
                onSelect={(tip) => onChange(tip.data)}
              />
              {onConfirm && (
                <DefaultButton
                  style={{ marginTop: padding }}
                  title={
                    alreadyTipped || tipSent
                      ? t('Caixinha enviada')
                      : selectedtip.title !== 'Sem caixinha'
                      ? `${t('Pagar ')} ${selectedtip.title} ${t('de')} ${t('caixinha')}`
                      : t('Escolha um valor')
                  }
                  disabled={alreadyTipped || selectedtip.data === 0 || isLoading || tipSent}
                  activityIndicator={isLoading}
                  onPress={() => onConfirm()}
                />
              )}
            </View>
          </View>
        </View>
      ) : (
        <View>
          <SingleHeader title={t('Entregador')} />
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: padding,
              paddingTop: halfPadding,
              paddingHorizontal: padding,
            }}
          >
            <RoundedProfileImg flavor="courier" id={order.courier?.id} size={64} />
            {order.courier?.joined && (
              <View style={{ marginLeft: halfPadding }}>
                <Text style={[texts.sm]}>{order.courier?.name}</Text>
                <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('No appJusto desde')}</Text>
                <Text style={{ ...texts.xs }}>
                  {formatDate(order.courier?.joined, 'monthYear')}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
