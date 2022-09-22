import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { useAdvanceByAmountSimulation } from '../../../../../common/store/api/courier/account/useAdvanceByAmountSimulation';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { showToast } from '../../../../../common/store/ui/actions';
import {
  biggerPadding,
  borders,
  colors,
  padding,
  screens,
  texts,
} from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { DeliveriesNavigatorParamList } from '../types';
import { useCanAdvanceReceivables } from './useCanAdvanceReceivables';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'AdvanceReceivables'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'AdvanceReceivables'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const AdvanceReceivables = ({ navigation, route }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const courier = useSelector(getCourier)!;
  // state
  const [accepted, setAccepted] = React.useState(false);
  const [requesting, setRequesting] = React.useState(false);
  // side effects
  const canAdvanceReceivables = useCanAdvanceReceivables();
  const simulationByAmount = useAdvanceByAmountSimulation();
  // tracking
  useSegmentScreen('AdvanceReceivables');
  // handlers
  const confirmHandler = async () => {
    setRequesting(true);
    try {
      if (!simulationByAmount) return;
      await api
        .courier()
        .advanceReceivablesByAmount(courier.id, simulationByAmount.nearest.simulation_id);
      track('courier advanced receivables');
      navigation.replace('RequestWithdrawFeedback', {
        header: t('Antecipação realizada com sucesso!'),
        description: t('O valor será transferido para sua conta em até 1 dia útil.'),
      });
    } catch (error) {
      dispatch(showToast('Não foi possível realizar a requisição. Tente novamente.', 'error'));
      setRequesting(false);
    }
  };
  // UI
  if (!simulationByAmount) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: biggerPadding }}>
          {t('Total a adiantar')}
        </Text>
        <Text style={{ ...texts.x2l, color: colors.green600 }}>
          {formatCurrency(simulationByAmount.nearest.advanceable_amount_cents)}
        </Text>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: biggerPadding }}>
          {t('Total de taxas de adiantamento')}
        </Text>
        <Text style={{ ...texts.x2l, color: colors.red }}>
          {`+ ${formatCurrency(simulationByAmount.nearest.advancement_fee_cents)}`}
        </Text>
        <PaddedView
          style={{
            marginTop: padding,
            backgroundColor: colors.white,
            ...borders.default,
            borderColor: colors.white,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Total a receber no adiantamento')}
            </Text>
          </View>
          <Text style={{ ...texts.x4l }}>
            {formatCurrency(
              simulationByAmount.nearest.advanceable_amount_cents -
                simulationByAmount.nearest.advancement_fee_cents
            )}
          </Text>
        </PaddedView>
        <View style={{ flex: 1 }} />
        <CheckField
          checked={accepted}
          text="Estou de acordo com as taxas cobradas para o adiantamento do valor"
          onPress={() => setAccepted(!accepted)}
        />
        <DefaultButton
          style={{ marginTop: biggerPadding }}
          title={canAdvanceReceivables ? t('Confirmar antecipação') : t('Fora do horário')}
          onPress={confirmHandler}
          activityIndicator={requesting}
          disabled={!canAdvanceReceivables || !accepted || requesting}
        />
      </PaddedView>
    </ScrollView>
  );
};
