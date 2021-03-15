import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ItemQuantity } from '../../food/restaurant/product/ItemQuantity';

type Props = {
  modalVisible: boolean;
};

export const OrderItemModal = ({ modalVisible }: Props) => {
  const observations = 'Ao ponto, mas sem sangue';
  const [quantity, setQuantity] = React.useState(1);
  return (
    <View style={{ flex: 1 }}>
      <Modal animationType="slide" visible={modalVisible} transparent>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            // flex: 1,
            paddingHorizontal: padding,
            paddingTop: padding,
            height: '50%',
            marginTop: 'auto',
            borderTopColor: colors.black,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
              ...borders.default,
              borderColor: colors.green500,
              backgroundColor: colors.green500,
              alignSelf: 'flex-end',
            }}
          >
            <MaterialIcons name="close" size={16} />
          </View>
          <Text style={{ ...texts.xl }}>{t('Filé de frango a parmegiana')}</Text>
          <View style={{ marginTop: padding }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Nome do complemento')}</Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Nome do complemento')}</Text>
          </View>
          <View>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Observações')}</Text>
            <DefaultInput
              editable={false}
              placeholder={t('Escreva sua mensagem')}
              multiline
              numberOfLines={6}
              value={observations}
              style={{ height: 80, marginTop: halfPadding }}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: 24 }}>
            <TouchableOpacity onPress={() => null}>
              <RoundedText>{t('Revisar detalhes do item')}</RoundedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => null} style={{ marginLeft: padding }}>
              <RoundedText color={colors.red}>{t('Remover')}</RoundedText>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }} />
          <View>
            <HR />
            <ItemQuantity
              style={{ marginVertical: padding }}
              value={quantity}
              minimum={0}
              // title={`${t('Adicionar')} ${formatCurrency(helpers.getItemTotal(orderItem!))}`}
              title={t('Atualizar')}
              disabled={false}
              onChange={(value) => setQuantity(value)}
              onSubmit={() => null}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
