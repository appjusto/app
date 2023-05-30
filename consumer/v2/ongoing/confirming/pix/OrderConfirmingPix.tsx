import { IuguPayment, Order, WithId } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import Pill from '../../../../../common/components/views/Pill';
import { IconPixLogo } from '../../../../../common/icons/icon-pix-logo';
import { useObservePendingOrderPayment } from '../../../../../common/store/api/order/payments/useObservePendingOrderPayment';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';

interface Props {
  order: WithId<Order>;
  onCancel: () => void;
}

export const OrderConfirmingPix = ({ order, onCancel }: Props) => {
  // context
  const dispatch = useDispatch<AppDispatch>();
  // state
  // const pendingInvoice = useObservePendingOrderInvoice(order.id);
  const pendingPayment = useObservePendingOrderPayment(order.id);
  const pix = (() => {
    if (pendingPayment) {
      if (pendingPayment.processor === 'iugu') return (pendingPayment as IuguPayment).pix;
      // } else if (pendingInvoice) return pendingInvoice.pix;
    }
    return null;
  })();
  // handlers
  const copyToClipboard = () => {
    (async () => {
      if (!pix?.qrcodeText) return;
      await Clipboard.setStringAsync(pix.qrcodeText);
      dispatch(showToast(t('Copiado!')));
    })();
  };
  // UI
  return (
    <ScrollView
      style={{ ...screens.config, ...screens.headless }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
        <IconPixLogo />
        <Text style={{ ...texts.sm, marginVertical: padding }}>
          {t('Se você vai pagar com este dispositivo clique no botão ')}
          <Text style={{ ...texts.bold }}>{t('copiar chave de pagamento ')}</Text>
          {t('abaixo.')}
        </Text>
        <Text style={{ ...texts.sm, marginBottom: padding }}>
          {t(
            'Em seguida, acesse o aplicativo do seu banco ou instituição financeira. Na seção Pix procure a opção '
          )}
          <Text style={{ ...texts.bold }}>{t('Pix Copia e Cola.')}</Text>
        </Text>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ width: '49%' }}>
            {pendingPayment ? (
              <Image source={{ uri: pix?.qrcode }} style={{ height: 156, width: 156 }} />
            ) : (
              <ActivityIndicator size="small" color={colors.black} />
            )}
          </View>
          <View style={{ width: '49%', flexDirection: 'row' }}>
            <View style={{ paddingTop: 2 }}>
              <Feather name="info" size={14} />
            </View>
            <View style={{ width: '90%' }}>
              <Text style={{ ...texts.sm, marginLeft: halfPadding }}>
                {t(
                  'Você também pode pagar através da leitura do QR Code ao lado usando outro dispositivo'
                )}
              </Text>
            </View>
          </View>
        </View>
      </PaddedView>
      <View style={{ flex: 1, paddingBottom: padding }}>
        <View style={{ flex: 1 }} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: padding,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pill color={colors.yellow} />
            <Text style={{ ...texts.md, ...texts.bold, marginLeft: 12 }}>
              {t('Aguardando pagamento')}
            </Text>
          </View>
          <Text style={{ ...texts.xl }}>{formatCurrency(order.fare!.total)}</Text>
        </View>
        <View>
          <DefaultButton
            title={pix?.qrcodeText ? t('Copiar chave de pagamento') : t('Criando pedido...')}
            style={{ marginTop: padding, marginHorizontal: padding }}
            onPress={copyToClipboard}
            disabled={!pix?.qrcodeText}
          />
          <DefaultButton
            title={t('Cancelar pedido')}
            variant="danger"
            style={{ marginHorizontal: padding, marginTop: padding }}
            onPress={onCancel}
          />
        </View>
      </View>
    </ScrollView>
  );
};
