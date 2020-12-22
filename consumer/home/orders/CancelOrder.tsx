import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId } from 'appjusto-types';
import { Issue } from 'appjusto-types/order/issues';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import useIssues from '../../../common/hooks/queries/useIssues';
import { documentAs } from '../../../common/store/api/types';
import { cancelOrder } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'CancelOrder'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'CancelOrder'>;

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
  const busy = useSelector(getUIBusy);
  const query = useIssues('consumer-cancel');

  // state
  const [reasons, setReasons] = useState<WithId<Issue>[]>([]);
  const [selectedReason, setSelectedReason] = useState<WithId<Issue>>();
  const [rejectionComment, setRejectionComment] = useState<string>('');

  // side effects
  // whenever data changes
  useEffect(() => {
    if (query.data) {
      setReasons(documentAs<Issue>(query.data));
    }
  }, [query.data]);

  // handlers
  const cancelHandler = useCallback(() => {
    (async () => {
      try {
        await dispatch(
          cancelOrder(api)(orderId, {
            reason: selectedReason!,
            comment: rejectionComment,
          })
        );
        navigation.replace('Home');
      } catch (error) {
        dispatch(showToast(error.toString()));
      }
    })();
  }, [selectedReason, rejectionComment]);

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
            {t('Por que você está cancelando o pedido?')}
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
              'Você pode usar o espaço abaixo para detalhar mais o cancelamento. Dessa forma conseguiremos melhorar nossos serviços:'
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
            onPress={cancelHandler}
            disabled={!selectedReason || busy}
            activityIndicator={busy}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
