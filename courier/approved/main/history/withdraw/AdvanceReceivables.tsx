import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { useAdvanceSimulation } from '../../../../../common/store/api/courier/account/useAdvanceSimulation';
import {
  biggerPadding,
  borders,
  colors,
  padding,
  screens,
  texts,
} from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { DeliveriesNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'AdvanceReceivables'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'AdvanceReceivables'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const AdvanceReceivables = ({ route }: Props) => {
  // state
  const [accepted, setAccepted] = React.useState(false);
  // side effects
  const simulation = useAdvanceSimulation(route.params.ids);
  // handlers
  const confirmHandler = () => null;
  // UI
  return (
    <View style={{ ...screens.config }}>
      {simulation ? (
        <PaddedView>
          <Text style={{ ...texts.sm }}>
            Para realizar a antecipação, será cobrada uma taxa de 0.0% + R$ 0.00 pela operação
            financeira.
          </Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginTop: biggerPadding }}>
            {t('Você selecionou')}
          </Text>
          <Text style={{ ...texts.x2l }}>{`${simulation.transactions.length} ${t(
            'corridas'
          )}`}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginTop: biggerPadding }}>
            {t('Total a adiantar')}
          </Text>
          <Text style={{ ...texts.x2l, color: colors.green600 }}>
            {`+ ${simulation.total.advanced_value}`}
          </Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginTop: biggerPadding }}>
            {t('Total de taxas de adiantamento')}
          </Text>
          <Text style={{ ...texts.x2l, color: colors.red }}>
            {`+ ${simulation.total.advance_fee}`}
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
            <Text style={{ ...texts.x4l }}>{simulation.total.received_value}</Text>
          </PaddedView>
          <CheckField
            style={{ marginTop: biggerPadding }}
            checked={accepted}
            text="Estou de acordo com as taxas cobradas para o adiantamento do valor"
            onPress={() => setAccepted(!accepted)}
          />
          <DefaultButton
            style={{ marginTop: biggerPadding }}
            title={t('Confirmar antecipação')}
            onPress={confirmHandler}
            disabled={!accepted}
          />
        </PaddedView>
      ) : null}
    </View>
  );
};
