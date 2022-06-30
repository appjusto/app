import { CancelOrderPayload, Issue, Order, WithId } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Modal, ModalProps, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import { ModalToast } from '../../../common/components/views/ModalToast';
import { useModalToastContext } from '../../../common/contexts/ModalToastContext';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { track } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedBusinessNavParamsList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<LoggedBusinessNavParamsList, 'BusinessNavigator'>;

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
  const navigation = useNavigation<ScreenNavigationProp>();
  const { showModalToast } = useModalToastContext();
  // state
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [isLoading, setLoading] = React.useState(false);
  const issues = useIssues('restaurant-cancel');
  // handler
  const cancelOrderHandler = () => {
    (async () => {
      if (!selectedIssue) {
        dispatch(
          showToast(t('Você precisa escolher um motivo para efetuar o cancelamento'), 'error')
        );
        showModalToast(t('Você precisa escolher um motivo para efetuar o cancelamento'), 'error');
        return;
      }
      try {
        setLoading(true);
        const cancellationData = {
          orderId: order.id,
          acknowledgedCosts: 0,
          params: { refund: ['products'] },
          cancellation: selectedIssue,
        } as CancelOrderPayload;
        await api.order().cancelBusinessOrder(cancellationData);
        track('restaurant canceled order');
        dispatch(showToast(t('Pedido cancelado com sucesso'), 'success'));
        showModalToast(t('Pedido cancelado com sucesso'), 'success');
        setLoading(false);
        onModalClose();
        navigation.navigate('BusinessNavigator', { screen: 'BusinessOrders' });
      } catch (error) {
        Sentry.Native.captureException(error);
        setLoading(false);
        showModalToast(t('Não foi possível efetuar o cancelamento. Tente novamente'), 'error');
        dispatch(showToast(t('Não foi possível efetuar o cancelamento. Tente novamente'), 'error'));
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
              }}
            >
              <DefaultButton
                title={t('Cancelar pedido')}
                variant="danger"
                onPress={() => {
                  cancelOrderHandler();
                  onCancelOrder();
                }}
                activityIndicator={isLoading}
              />
            </View>
            <ModalToast />
          </View>
        </View>
      </View>
    </Modal>
  );
};
