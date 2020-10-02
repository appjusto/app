import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { ProfileIcon } from '../../../../common/components/icons/RoundedIcon';
import Pill from '../../../../common/components/views/Pill';
import { halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  courierId: string;
  courierName: string;
};

export default function ({ courierId, courierName }: Props) {
  // context
  // const api = useContext(ApiContext);
  // const dispatch = useDispatch<AppDispatch>();

  // data
  const data: HorizontalSelectItem[] = [
    { id: '0', title: t('Sem gorjeta'), data: 0 },
    { id: '1', title: formatCurrency(100), data: 100 },
    { id: '3', title: formatCurrency(300), data: 300 },
    { id: '5', title: formatCurrency(500), data: 500 },
    { id: '8', title: formatCurrency(800), data: 800 },
    { id: '10', title: formatCurrency(1000), data: 1000 },
    { id: '15', title: formatCurrency(1500), data: 1500 },
    { id: '30', title: formatCurrency(3000), data: 3000 },
  ];
  // state
  const [feedback, setFeedback] = useState(data[0]);
  // handlers
  useEffect(() => {
    // TODO: send feedback
  }, [feedback]);
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
          <Text style={{ ...texts.medium, ...texts.bold }}>{t('Gorjeta')}</Text>
        </PaddedView>
      </View>
      <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
        <View style={{ flexDirection: 'row', paddingBottom: padding }}>
          <ProfileIcon />
          <View style={{ marginLeft: halfPadding }}>
            <Text style={[texts.medium]}>
              {t('Gorjeta para')} {courierName}
            </Text>
            <Text style={[texts.small]}>
              {t('Valorize ainda mais o trabalho do seu entregador')}
            </Text>
          </View>
        </View>
        <HorizontalSelect data={data} selected={feedback} onSelect={setFeedback} />
      </View>
    </View>
  );
}
