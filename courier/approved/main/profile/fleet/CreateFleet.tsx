import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import HR from '../../../../../common/components/views/HR';
import { useSegmentScreen } from '../../../../../common/store/api/track';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { CourierProfileParamList } from '../types';
import FleetRule from './FleetRule';
import FleetSummary from './FleetSummary';
import GainSimulator from './GainSimulator';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'CreateFleet'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'CreateFleet'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const courier = useSelector(getCourier)!;
  // screen state
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [distanceThreshold, setDistanceThreshold] = React.useState(5000);
  const [minimumFee, setMinimumFee] = React.useState(1000);
  const [additionalPerKmAfterThreshold, setAdditionalPerKmAfterThreshold] = React.useState(200);
  const [maxDistance, setMaxDistance] = React.useState(30000);
  const [maxDistanceToOrigin, setMaxDistanceToOrigin] = React.useState(15000);
  const [isLoading, setLoading] = React.useState(false);
  const canSubmit = !isEmpty(name) && !isEmpty(description);
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const descriptionRef = React.useRef<TextInput>(null);
  // side effects
  // tracking
  useSegmentScreen('Create Fleet');
  // initial focus
  React.useEffect(() => {
    nameRef.current?.focus();
  }, []);
  // handlers
  const createFleetHandler = async () => {
    try {
      setLoading(true);
      const fleet = await api.fleet().createFleet({
        name,
        description,
        distanceThreshold,
        minimumFee,
        additionalPerKmAfterThreshold,
        maxDistance,
        maxDistanceToOrigin,
        situation: 'approved',
        createdBy: courier.id,
        participantsOnline: 0,
      });
      api.search().clearCache();
      dispatch(showToast(t('Frota criada com sucesso!')));
      navigation.replace('FleetDetail', { fleetId: fleet.id });
    } catch (error) {
      setLoading(false);
      console.log(error);
      Sentry.Native.captureException(error);
      dispatch(showToast(t('Não foi possível criar a frota.'), 'error'));
    }
  };

  // UI
  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
      <View style={{ ...screens.config }}>
        <PaddedView>
          <Text style={{ ...texts.x2l }}>{t('Criar nova frota')}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginVertical: 8 }}>
            {t('Preencha as informações da sua frota')}
          </Text>
          <DefaultInput
            ref={nameRef}
            style={{ marginBottom: 4 }}
            title={t('Nome')}
            placeholder={t('Nome da frota em até 36 caracteres')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            maxLength={36}
            onChangeText={setName}
            onSubmitEditing={() => descriptionRef.current?.focus()}
          />
          <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: padding }}>
            {name.length}/36 {t('caracteres')}
          </Text>
          <DefaultInput
            ref={descriptionRef}
            style={{ marginBottom: 4, height: 126 }}
            title={t('Descrição')}
            placeholder={t('Descreva sua frota em até 140 caracteres')}
            value={description}
            maxLength={140}
            numberOfLines={3}
            returnKeyType="done"
            blurOnSubmit
            onChangeText={setDescription}
          />
          <Text style={{ ...texts.xs, color: colors.grey700, marginBottom: padding }}>
            {description.length}/140 {t('caracteres')}
          </Text>
          <View>
            <FleetRule
              title={t('Pagamento Mínimo')}
              onIncrease={() => setMinimumFee(minimumFee + 100)}
              onDecrease={() => setMinimumFee(minimumFee - 100)}
              value={formatCurrency(minimumFee)}
              description={t(
                'Defina o valor que os/as entregadores/as dessa frota receberão ao percorrer a Distância Inicial Mínima.'
              )}
            />
            <FleetRule
              title={t('Distância Inicial Mínima')}
              onIncrease={() => setDistanceThreshold(distanceThreshold + 1000)}
              onDecrease={() => setDistanceThreshold(distanceThreshold - 1000)}
              value={formatDistance(distanceThreshold)}
              description={t(
                'Defina em Km a distância para o Pagamento Mínimo. Abaixo dessa distância, os/as entregadores/as dessa frota receberão o Pagamento Mínimo. Acima dessa distância, os/as entregadores/as receberão um Valor Adicional por Km Rodado.'
              )}
            />
            <FleetRule
              title={t('Valor Adicional por Km Rodado')}
              onIncrease={() =>
                setAdditionalPerKmAfterThreshold(additionalPerKmAfterThreshold + 10)
              }
              onDecrease={() =>
                setAdditionalPerKmAfterThreshold(additionalPerKmAfterThreshold - 10)
              }
              value={formatCurrency(additionalPerKmAfterThreshold)}
              description={t(
                'Defina o valor adicional que os/as entregadores/as dessa frota receberão por Km ao percorrer uma distância acima da Distância Inicial Mínima.'
              )}
            />
            <FleetRule
              title={t('Distância Máxima para Entrega')}
              onIncrease={() => setMaxDistance(maxDistance + 1000)}
              onDecrease={() => setMaxDistance(maxDistance - 1000)}
              value={formatDistance(maxDistance)}
              description={t(
                'Defina em Km a distância máxima que os/as entregadores/as dessa frota poderão percorrer para fazer uma entrega. Pedidos recebidos com distância máxima acima da definida não serão exibidos.'
              )}
            />
            <FleetRule
              title={t('Distância Máxima até a Origem')}
              onIncrease={() => setMaxDistanceToOrigin(maxDistanceToOrigin + 1000)}
              onDecrease={() => setMaxDistanceToOrigin(maxDistanceToOrigin - 1000)}
              value={formatDistance(maxDistanceToOrigin)}
              description={t(
                'Defina em Km a distância máxima da posição atual até a origem do pedido que essa frota poderá percorrer. Pedidos recebidos com origem acima da definida não serão exibidos.'
              )}
            />
          </View>
        </PaddedView>
        <FleetSummary
          minimumFee={minimumFee}
          distanceThreshold={distanceThreshold}
          maxDistance={maxDistance}
          maxDistanceToOrigin={maxDistanceToOrigin}
          additionalPerKmAfterThreshold={additionalPerKmAfterThreshold}
        />
        <View>
          <HR height={padding / 2} />
          <GainSimulator
            fee={minimumFee}
            distance={distanceThreshold}
            additional={additionalPerKmAfterThreshold}
          />
          <PaddedView>
            <DefaultButton
              style={{ marginTop: padding * 2 }}
              title={t('Confirmar criação da frota')}
              onPress={createFleetHandler}
              disabled={!canSubmit || isLoading}
              activityIndicator={isLoading}
            />
          </PaddedView>
        </View>
      </View>
    </ScrollView>
  );
}
