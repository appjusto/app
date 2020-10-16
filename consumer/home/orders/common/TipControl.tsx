import React, { useCallback, useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../../common/components/icons/RoundedProfileImg';
import Pill from '../../../../common/components/views/Pill';
import { tipCourier } from '../../../../common/store/order/actions';
import { showToast } from '../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  orderId: string;
  orderTip: number;
  courierId: string;
  courierName: string;
};

export default function ({ orderId, orderTip = 0, courierId, courierName }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const alreadyTipped = orderTip > 0;

  // app state
  const busy = useSelector(getUIBusy);

  // data
  const data: HorizontalSelectItem[] = [
    { id: '0', title: t('Sem caixinha'), data: 0 },
    { id: '1', title: formatCurrency(100), data: 100 },
    { id: '3', title: formatCurrency(300), data: 300 },
    { id: '5', title: formatCurrency(500), data: 500 },
    { id: '8', title: formatCurrency(800), data: 800 },
    { id: '10', title: formatCurrency(1000), data: 1000 },
    { id: '15', title: formatCurrency(1500), data: 1500 },
    { id: '30', title: formatCurrency(3000), data: 3000 },
  ];

  // state
  const [tip, setTip] = useState(data.find((d) => d.data === orderTip) ?? data[0]);

  // handlers
  const tipHandler = useCallback(() => {
    (async () => {
      try {
        await dispatch(tipCourier(api)(orderId, tip.data));
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar a gorjeta.')));
      }
    })();
  }, [tip]);
  // UI
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pill />
        <PaddedView
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.medium, ...texts.bold }}>{t('Caixinha')}</Text>
        </PaddedView>
      </View>
      <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
        <View style={{ flexDirection: 'row', paddingBottom: padding }}>
          <RoundedProfileImg flavor="courier" id={courierId} />
          <View style={{ marginLeft: halfPadding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Valorize ainda mais o trabalho do seu entregador')}
            </Text>
            <Text style={[texts.default]}>{courierName}</Text>
          </View>
        </View>
        <HorizontalSelect disabled={orderTip > 0} data={data} selected={tip} onSelect={setTip} />
        <DefaultButton
          style={{ marginTop: padding }}
          title={alreadyTipped ? t('Caixinha enviada') : t('Enviar caixinha')}
          disabled={alreadyTipped || tip.data === 0 || busy}
          activityIndicator={busy}
          onPress={tipHandler}
        />
      </View>
    </View>
  );
}
