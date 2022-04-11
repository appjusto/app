import { CancelOrderPayload, InvoiceType, Issue, Order, WithId } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Keyboard, Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { calculateCancellationCosts } from '../helpers';

interface Props extends ModalProps {
  order: WithId<Order>;
  modalVisible: boolean;
  onModalClose: () => void;
  onCancelOrder: () => void;
}

export const CancelOrderModal = ({ order, onModalClose, modalVisible, onCancelOrder }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [orderCancellationCosts, setOrderCancellationCosts] = React.useState<number>();
  const [isLoading, setLoading] = React.useState(false);
  const navigation = useNavigation();
  const issues = useIssues('restaurant-cancel');
  // side effects
  React.useEffect(() => {
    if (!order) return;
    let debt = [] as InvoiceType[];
    //if (['preparing', 'ready'].includes(order.status)) debt.push('platform');
    //if (order.dispatchingState === 'arrived-pickup') debt.push('delivery');
    const cancellationCosts = calculateCancellationCosts(order, { refund: debt });
    setOrderCancellationCosts(cancellationCosts);
  }, [order]);
  // handler
  const cancelOrderHandler = () => {
    (async () => {
      Keyboard.dismiss();
      try {
        setLoading(true);
        const cancellationData = {
          orderId: order.id,
          acknowledgedCosts: orderCancellationCosts,
          cancellation: selectedIssue,
        } as CancelOrderPayload;
        await api.order().cancelBusinessOrder(cancellationData);
        dispatch(showToast('Pedido cancelado com sucesso', 'success'));
        setLoading(false);
        navigation.goBack();
      } catch (error) {
        setLoading(false);
        dispatch(showToast('Não foi possível efetuar o cancelamento. Tente novamente', 'error'));
      }
    })();
  };
  // UI
  if (!issues) return null;
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
          <View style={{ paddingHorizontal: padding, marginBottom: 24 }}>
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Text style={{ ...texts.xl }}>{t('Cancelar pedido')}</Text>
                <MaterialIcons name="close" size={20} />
              </View>
            </TouchableOpacity>
            <Text style={{ ...texts.sm, marginTop: padding }}>
              {t(
                'Você tem certeza que deseja cancelar esse pedido? O consumidor será notificado sobre o seu cancelamento.'
              )}
            </Text>
          </View>
          <View>
            {issues.map((issue) => (
              <View style={{ marginBottom: padding, paddingHorizontal: padding }} key={issue.id}>
                <RadioButton
                  title={issue.title}
                  onPress={() => setSelectedIssue(issue)}
                  checked={selectedIssue?.id === issue.id}
                />
              </View>
            ))}
          </View>
          <View
            style={{
              paddingTop: halfPadding,
              borderTopColor: colors.grey500,
              borderTopWidth: 1,
            }}
          >
            <View
              style={{
                paddingHorizontal: padding,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ width: '48%' }}>
                <DefaultButton title={t('Aceitar pedido')} />
              </View>
              <View style={{ width: '48%' }}>
                <DefaultButton
                  title={t('Cancelar pedido')}
                  grey
                  style={{ backgroundColor: colors.red }}
                  onPress={() => {
                    cancelOrderHandler();
                    onCancelOrder();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
