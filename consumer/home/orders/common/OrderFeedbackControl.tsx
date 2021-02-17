import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../../common/components/containers/PaddedView';
import Pill from '../../../../common/components/views/Pill';
import { padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  orderId: string;
};

export default function ({ orderId }: Props) {
  // context
  // const api = useContext(ApiContext);
  // const dispatch = useDispatch<AppDispatch>();

  // data
  const data: HorizontalSelectItem[] = [
    {
      id: 'yes',
      title: t('Sim, tudo certo'),
    },
    {
      id: 'no',
      title: t('Não, tive um problema'),
    },
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
          <Text style={{ ...texts.md, ...texts.bold }}>
            {t('Seu pedido foi entregue corretamente?')}
          </Text>
        </PaddedView>
      </View>
      <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
        <HorizontalSelect data={data} selected={feedback} onSelect={setFeedback} />
      </View>
    </View>
  );
}
