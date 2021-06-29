import React from 'react';
import { Text, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const DeliveryConfirmation = () => {
  const codeFeedbackData: HorizontalSelectItem[] = [
    { title: t('Encontrar com o entregador'), id: '1' },
    { title: t('Deixar na portaria'), id: '2' },
  ];
  const [codeFeedback, setCodeFeedback] = React.useState<HorizontalSelectItem>(codeFeedbackData[0]);
  return (
    <View style={{ backgroundColor: colors.white, paddingVertical: padding, flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SingleHeader title={t('Confirmação da entrega')} />
        <View style={{ paddingHorizontal: padding, paddingTop: halfPadding }}>
          <HorizontalSelect
            data={codeFeedbackData}
            selected={codeFeedback}
            onSelect={setCodeFeedback}
          />
        </View>

        <PaddedView>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t(
              'O entregador pedirá os 3 primeiros dígitos do seu CPF para confirmar a entrega. Se preferir, você pode desativar a necessidade do código de confirmação.'
            )}
          </Text>
        </PaddedView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: padding,
            flex: 1,
          }}
        >
          <Switch />
          <Text style={{ ...texts.sm, marginLeft: halfPadding }}>{t('Código de confirmação')}</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ ...texts.x4l }}>000</Text>
        </View>
      </View>
    </View>
  );
};
