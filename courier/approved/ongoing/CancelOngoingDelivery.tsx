import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId } from 'appjusto-types';
import { Issue } from 'appjusto-types/order/issues';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { getCourier } from '../../../common/store/courier/selectors';
import { showToast } from '../../../common/store/ui/actions';
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
  // params
  const { orderId } = route.params;
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const courier = useSelector(getCourier)!;
  // state
  const issues = useIssues('courier-cancel');
  const [selectedReason, setSelectedReason] = useState<WithId<Issue>>();
  const [rejectionComment, setRejectionComment] = useState<string>('');
  const [isLoading, setLoading] = React.useState(false);
  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handlers
  const sendRejectionHandler = () => {
    (async () => {
      try {
        setLoading(true);
        await api.order().rejectOrder(orderId, {
          courierId: courier.id,
          reason: selectedReason!,
          comment: rejectionComment,
        });
        navigation.replace('MainNavigator', {
          screen: 'HomeNavigator',
          params: {
            screen: 'Home',
          },
        });
      } catch (error) {
        setLoading(false);
        dispatch(showToast(error.toString()));
      }
    })();
  };
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <PaddedView>
          <Text style={{ ...texts.xxl, marginBottom: 24 }}>
            {t('Por que você quer cancelar o pedido?')}
          </Text>
          {issues.map((issue) => (
            <TouchableOpacity key={issue.id} onPress={() => setSelectedReason(issue)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Image
                  source={selectedReason?.id === issue.id ? icons.circleActive : icons.circle}
                />
                <Text style={{ ...texts.xs, marginLeft: 12 }}>{issue.title}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={{ ...texts.sm, marginBottom: 8, marginTop: 24 }}>
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
              borderColor: colors.grey500,
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
            disabled={!selectedReason || isLoading}
            activityIndicator={isLoading}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
