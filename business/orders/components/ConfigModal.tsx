import { Business, WithId } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ModalProps, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ModalProps {
  business: WithId<Business>;
  modalVisible: boolean;
  onModalClose: () => void;
}

export const ConfigModal = ({ business, modalVisible, onModalClose }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const [printOrder, setPrintOrder] = React.useState(business.orderPrinting ?? false);
  // handlers
  const printOrderHandler = async () => {
    try {
      // toggling orderPrinting state in database
      await api.business().updateBusiness(business.id, { orderPrinting: !printOrder });
      setPrintOrder(!printOrder);
    } catch (error: any) {
      console.log(error.toString());
      Sentry.Native.captureException(error);
      dispatch(
        showToast('Não conseguimos atualizar o pedido nesse momento. Tente novamente.', 'error')
      );
    }
  };
  //UI
  return (
    <Modal transparent visible={modalVisible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            ...borders.default,
            paddingTop: padding,
            paddingBottom: halfPadding,
          }}
        >
          <View style={{ paddingHorizontal: padding, marginBottom: padding }}>
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Text style={{ ...texts.xl }}>{t('Configurações')}</Text>
                <MaterialIcons name="close" size={20} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={{ ...texts.sm, marginTop: padding }}>
                {t('Imprimir pedido ao confirmar')}
              </Text>
              <View style={{ marginTop: halfPadding, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ borderWidth: 2, borderColor: colors.black, borderRadius: 16 }}>
                  <Switch
                    trackColor={{ false: colors.white, true: colors.white }}
                    thumbColor={printOrder ? colors.green500 : colors.yellow}
                    ios_backgroundColor={colors.white}
                    onValueChange={printOrderHandler}
                    value={printOrder}
                  />
                </View>
                <Text style={{ ...texts.sm, marginLeft: padding, color: colors.grey700 }}>
                  {printOrder ? t('Ativado') : t('Desativado')}
                </Text>
              </View>
              <View
                style={{
                  borderTopColor: colors.grey500,
                  borderTopWidth: 1,
                  marginTop: 24,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
