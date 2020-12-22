import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import HR from '../../../../../common/components/views/HR';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { createFleet } from '../../../../../common/store/fleet/actions';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import FleetRule from './FleetRule';
import FleetSummary from './FleetSummary';
import GainSimulator from './GainSimulator';
import { FleetParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<FleetParamList, 'CreateFleet'>;
type ScreenRouteProp = RouteProp<FleetParamList, 'CreateFleet'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // refs
  const nameRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;

  // screen state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [distanceThreshold, setDistanceThreshold] = useState(1000);
  const [minimumFee, setMinimumFee] = useState(300);
  const [additionalPerKmAfterThreshold, setAdditionalPerKmAfterThreshold] = useState(100);
  const [maxDistance, setMaxDistance] = useState(10000);
  const [maxDistanceToOrigin, setMaxDistanceToOrigin] = useState(3000);
  const canSubmit = useMemo(() => {
    return !isEmpty(name) && !isEmpty(description);
  }, [name, description]);

  // effects
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // handlers
  const createFleetHandler = async () => {
    await dispatch(
      createFleet(api)({
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
      })
    );
    navigation.goBack();
  };

  // replace all the sliders with the new counter

  // UI
  return (
    <ScrollView>
      <View style={{ ...screens.config }}>
        <PaddedView>
          <Text style={{ ...texts.big }}>{t('Criar nova frota')}</Text>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginVertical: 8 }}>
            {t('Preencha as informações da sua frota')}
          </Text>
          <DefaultInput
            ref={nameRef}
            title={t('Nome')}
            placeholder={t('Nome da frota em até 36 caracteres')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            maxLength={36}
            onChangeText={setName}
            onSubmitEditing={() => descriptionRef.current?.focus()}
            keyboardType="default"
            style={{ marginBottom: 4 }}
          />
          {/* add logic to the counter below */}
          <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: padding }}>
            0/36 {t('caracteres')}
          </Text>
          <DefaultInput
            ref={descriptionRef}
            title={t('Descrição')}
            placeholder={t('Descreva sua frota em até 140 caracteres')}
            value={description}
            returnKeyType="next"
            blurOnSubmit={false}
            maxLength={140}
            numberOfLines={3}
            onChangeText={setDescription}
            keyboardType="default"
            style={{ marginBottom: 4 }}
          />
          {/* add logic to the counter below */}
          <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: padding }}>
            0/140 {t('caracteres')}
          </Text>
          <View>
            <FleetRule
              title={t('Pagamento Mínimo')}
              onIncrease={() => setMinimumFee(minimumFee + 100)}
              onDecrease={() => setMinimumFee(minimumFee - 100)}
              value={formatCurrency(minimumFee)}
              description={t(
                'Defina o valor que os entregadores dessa frota receberão ao percorrer a Distância Inicial Mínima.'
              )}
            />
            <FleetRule
              title={t('Distância Inicial Mínima')}
              onIncrease={() => setDistanceThreshold(distanceThreshold + 1000)}
              onDecrease={() => setDistanceThreshold(distanceThreshold - 1000)}
              value={formatDistance(distanceThreshold)}
              description={t(
                'Defina em Km a distância para o Pagamento Mínimo. Abaixo dessa distância, os entregadores dessa frota receberão o Pagamento Mínimo. Acima dessa distância, os entregadores receberão um Valor Adicional por Km Rodado.'
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
                'Defina o valor adicional que os entregadores dessa frota receberão por Km ao percorrer uma distância acima da Distância Inicial Mínima.'
              )}
            />
            <FleetRule
              title={t('Distância Máxima para Entrega')}
              onIncrease={() => setMaxDistance(maxDistance + 1000)}
              onDecrease={() => setMaxDistance(maxDistance - 1000)}
              value={formatDistance(maxDistance)}
              description={t(
                'Defina em Km a distância máxima que os entregadores dessa frota poderão percorrer para fazer uma entrega. Pedidos recebidos com distância máxima acima da definida não serão exibidos.'
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
        />
        <View>
          <HR height={padding / 4} />
          <GainSimulator fee={minimumFee} distance={distanceThreshold} />
          <PaddedView>
            <DefaultButton
              style={{ marginTop: padding * 2 }}
              title={t('Confirmar criação da frota')}
              onPress={createFleetHandler}
              disabled={!canSubmit || busy}
              activityIndicator={busy}
            />
          </PaddedView>
        </View>
      </View>
    </ScrollView>
  );
}
