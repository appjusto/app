import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderRejectionReason, WithId } from 'appjusto-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { getCourier } from '../../../common/store/courier/selectors';
import { fetchRejectionReasons, rejectOrder } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingParamList, 'CancelOngoingDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRouteProp = RouteProp<OngoingParamList, 'CancelOngoingDelivery'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { orderId } = route.params;

  // app state
  const courier = useSelector(getCourier)!;
  const busy = useSelector(getUIBusy);

  // state
  const [reasons, setReasons] = useState<WithId<OrderRejectionReason>[]>([]);
  const [selectedReason, setSelectedReason] = useState<WithId<OrderRejectionReason>>();
  const [rejectionComment, setRejectionComment] = useState<string>('');

  // side effects
  // once
  useEffect(() => {
    (async () => {
      try {
        setReasons(await dispatch(fetchRejectionReasons(api)('cancel')));
      } catch (error) {
        dispatch(showToast(t('Não foi possível carregar os dados.')));
      }
    })();
  }, []);

  // handlers
  const sendRejectionHandler = useCallback(() => {
    (async () => {
      try {
        await dispatch(
          rejectOrder(api)(orderId, {
            courierId: courier.id,
            reason: selectedReason!,
            comment: rejectionComment,
          })
        );
        navigation.replace('MainNavigator', {
          screen: 'HomeNavigator',
          params: {
            screen: 'Home',
          },
        });
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar o comentário')));
      }
    })();
  }, [courier, selectedReason, rejectionComment]);

  // UI
  if (reasons.length === 0)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView>
        <PaddedView>
          <Text style={{ ...texts.big, marginBottom: 24 }}>
            {t('Por que você quer cancelar o pedido?')}
          </Text>
          {reasons.map((reason) => (
            <TouchableOpacity key={reason.id} onPress={() => setSelectedReason(reason)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Image
                  source={selectedReason?.id === reason.id ? icons.circleActive : icons.circle}
                />
                <Text style={{ ...texts.small, marginLeft: 12 }}>{reason.title}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={{ ...texts.default, marginBottom: 8, marginTop: 24 }}>
            {t(
              'Você pode usar o espaço abaixo para detalhar seus motivos. Dessa forma conseguiremos melhorar nossos serviços:'
            )}
          </Text>
          <TextInput
            placeholder={t('Escreva sua mensagem')}
            style={{
              width: '100%',
              height: 128,
              ...borders.default,
              borderColor: colors.grey,
              backgroundColor: colors.white,
              marginBottom: 8,
              padding: 8,
            }}
            multiline
            onChangeText={setRejectionComment}
            value={rejectionComment}
            textAlignVertical="top"
            blurOnSubmit
          />
          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Enviar')}
            onPress={sendRejectionHandler}
            disabled={!selectedReason || busy}
            activityIndicator={busy}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
