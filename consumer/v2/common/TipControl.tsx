import { Order } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { formatCurrency, formatDate } from '../../../common/utils/formatters';
import { t } from '../../../strings';

type Props = {
  order: Order;
  tip: number;
  onChange: (value: number) => void;
  isLoading?: boolean;
  onConfirm?: () => void;
  tipSent?: boolean;
};

const data: HorizontalSelectItem[] = [
  { id: '0', title: t('Sem caixinha'), data: 0 },
  { id: '3', title: formatCurrency(300), data: 300 },
  { id: '5', title: formatCurrency(500), data: 500 },
  { id: '8', title: formatCurrency(800), data: 800 },
  { id: '10', title: formatCurrency(1000), data: 1000 },
  { id: '15', title: formatCurrency(1500), data: 1500 },
  { id: '30', title: formatCurrency(3000), data: 3000 },
];

export default function ({ order, tip, isLoading = false, onChange, onConfirm, tipSent }: Props) {
  const alreadyTipped = Boolean(order.tip?.value);
  const selectedtip =
    data.find((item) => item.data === order.tip?.value || (!alreadyTipped && item.data === tip)) ??
    data[0];
  // UI
  return (
    <View style={{ paddingHorizontal: padding, paddingTop: padding }}>
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
              <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('No appJusto desde')}</Text>
              <Text style={{ ...texts.xs }}>{formatDate(order.courier?.joined, 'monthYear')}</Text>
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
  );
}
