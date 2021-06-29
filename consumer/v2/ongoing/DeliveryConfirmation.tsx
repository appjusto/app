import React from 'react';
import { Text, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { IconFastFood } from '../../../common/icons/icon-fast-food';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  data: HorizontalSelectItem[];
  selected: HorizontalSelectItem;
  onSelect: (value: HorizontalSelectItem) => void;
  switchValue: boolean;
  onChangeCodeDelivery: (value: boolean) => void;
};

export const DeliveryConfirmation = ({
  data,
  selected,
  onSelect,
  switchValue,
  onChangeCodeDelivery,
}: Props) => {
  return (
    <View style={{ backgroundColor: colors.white, paddingTop: padding, flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SingleHeader title={t('Confirmação da entrega')} />
        <View style={{ paddingHorizontal: padding, paddingTop: halfPadding }}>
          <HorizontalSelect data={data} selected={selected} onSelect={onSelect} />
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
          <View
            style={{
              ...borders.default,
              backgroundColor: colors.white,
              borderColor: colors.black,
              borderWidth: 2,
              borderRadius: 32,
            }}
          >
            <Switch
              trackColor={{ false: colors.white, true: colors.white }}
              value={switchValue}
              thumbColor={switchValue ? colors.green500 : colors.yellow}
              ios_backgroundColor={colors.white}
              onValueChange={onChangeCodeDelivery}
            />
          </View>
          <Text style={{ ...texts.sm, marginLeft: halfPadding }}>{t('Código de confirmação')}</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ ...texts.x4l }}>000</Text>
        </View>
        <PaddedView style={{ backgroundColor: colors.grey50, flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <IconFastFood />
            <View style={{ marginLeft: padding, maxWidth: '82%' }}>
              <Text style={{ ...texts.sm }}>
                {t('Lembre-se: o entregador não deve cobrar nada ao entregar seu pedido')}
              </Text>
              <Text style={{ ...texts.xs, marginTop: halfPadding, color: colors.grey700 }}>
                {t(
                  'O seu pedido já foi pago e não necessita de nenhuma pagamento adicional. Se isso acontecer, relate o problema para nós.'
                )}
              </Text>
            </View>
          </View>
        </PaddedView>
      </View>
    </View>
  );
};
