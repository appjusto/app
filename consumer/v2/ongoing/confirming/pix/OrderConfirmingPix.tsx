import { Order, WithId } from '@appjusto/types';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import Pill from '../../../../../common/components/views/Pill';
import { IconPixLogo } from '../../../../../common/icons/icon-pix-logo';
import { usePendingOrderInvoice } from '../../../../../common/store/api/order/invoices/usePendingOrderInvoice';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../../../common/styles';
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
  const pendingInvoice = usePendingOrderInvoice(order.id);
  // handlers
  const copyToClipboard = () => {
    (async () => {
      if (!pendingInvoice?.pix?.qrcodeText) return;
      await Clipboard.setStringAsync(pendingInvoice.pix.qrcodeText);
      dispatch(showToast(t('Copiado!')));
    })();
  };
  // UI
  console.log(pendingInvoice?.pix?.qrcodeText);
  return (
    <SafeAreaView style={{ ...screens.default }}>
      <PaddedView>
        <IconPixLogo />
        <Text style={{ ...texts.lg, marginTop: 24 }}>{t('Efetue o pagamento da sua fatura')}</Text>
        <Text style={{ ...texts.sm, marginVertical: padding, color: colors.grey700 }}>
          {t(
            'Se você vai pagar com este mesmo dispositivo clique no botão "Copiar chave de pagamento".'
          )}
        </Text>
        <Text style={{ ...texts.sm, marginBottom: padding, color: colors.grey700 }}>
          {t(
            'Depois, acesse o aplicativo do seu banco ou instituição financeira na seção Pix e procure a função "Pix Copia e Cola".'
          )}
        </Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ width: '49%' }}>
            {pendingInvoice ? (
              <Image source={{ uri: pendingInvoice.pix!.qrcode }} />
            ) : (
              <ActivityIndicator size="small" color={colors.black} />
            )}
          </View>
          <View style={{ width: '49%' }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t(
                'Você ou outra pessoa também podem efetuar o pagamento através do QR Code ao lado'
              )}
            </Text>
          </View>
        </View>
        <DefaultButton
          title={t('Copiar chave de pagamento')}
          style={{ marginTop: padding }}
          onPress={copyToClipboard}
          disabled={!pendingInvoice?.pix?.qrcodeText}
        />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1, marginBottom: padding }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: padding,
            marginBottom: padding,
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
        <Text style={{ ...texts.xs, color: colors.grey700, paddingHorizontal: padding }}>
          {t(
            'Identificaremos o pagamento assim que ele for realizado e daremos continuidade ao seu pedido.'
          )}
        </Text>
        <DefaultButton
          title={t('Cancelar pedido')}
          variant="danger"
          style={{ marginHorizontal: padding, marginTop: 24 }}
          onPress={onCancel}
        />
      </View>
    </SafeAreaView>
  );
};
