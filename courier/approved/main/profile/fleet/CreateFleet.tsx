import Slider, { SliderProps } from '@react-native-community/slider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import HR from '../../../../../common/components/views/HR';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { createFleet } from '../../../../../common/store/fleet/actions';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { texts, screens, colors, padding } from '../../../../../common/styles';
import { formatCurrency, formatDistance, formatPct } from '../../../../../common/utils/formatters';
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

function CustomSlider(props: SliderProps) {
  return (
    <Slider
      style={{ width: '100%', height: 40, marginTop: 12 }}
      minimumValue={0}
      minimumTrackTintColor="#000000"
      maximumTrackTintColor="#000000"
      {...(props as any)}
    />
  );
}

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
  const [valueThreshold, setValueThreshold] = useState(100);
  const [feePctOverValue, setFeePcTOverValue] = useState(0);
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
        valueThreshold,
        feePctOverValue,
        situation: 'approved',
        createdBy: courier.id,
      })
    );
    navigation.goBack();
  };

  // replace all the sliders with the new counter

  // UI
  return (
    <ScrollView>
      <View style={{ ...screens.configScreen }}>
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
              formattedValue={formatCurrency(minimumFee)}
              description={t(
                'Defina o valor que os entregadores dessa frota receberão ao percorrer a Distância Inicial Mínima.'
              )}
            />
            <CustomSlider
              value={minimumFee}
              maximumValue={5000}
              step={500}
              onValueChange={setMinimumFee}
            />
            <FleetRule
              title={t('Distância Inicial Mínima')}
              formattedValue={formatDistance(distanceThreshold)}
              description={t(
                'Defina em Km a distância para o Pagamento Mínimo. Abaixo dessa distância, os entregadores dessa frota receberão o Pagamento Mínimo. Acima dessa distância, os entregadores receberão um Valor Adicional por Km Rodado.'
              )}
            />
            <CustomSlider
              value={distanceThreshold}
              minimumValue={100}
              maximumValue={3000}
              step={50}
              onValueChange={setDistanceThreshold}
            />
            <FleetRule
              title={t('Valor Adicional por Km Rodado')}
              formattedValue={formatCurrency(additionalPerKmAfterThreshold)}
              description={t(
                'Defina o valor adicional que os entregadores dessa frota receberão por Km ao percorrer uma distância acima da Distância Inicial Mínima.'
              )}
            />
            <CustomSlider
              value={additionalPerKmAfterThreshold}
              minimumValue={100}
              maximumValue={3000}
              step={50}
              onValueChange={setAdditionalPerKmAfterThreshold}
            />
            <FleetRule
              title={t('Distância Máxima para Entrega')}
              formattedValue={formatDistance(maxDistance)}
              description={t(
                'Defina em Km a distância máxima que os entregadores dessa frota poderão percorrer para fazer uma entrega. Pedidos recebidos com distância máxima acima da definida não serão exibidos.'
              )}
            />
            <CustomSlider
              value={maxDistance}
              maximumValue={20000}
              step={500}
              onValueChange={setMaxDistance}
            />
            <FleetRule
              title={t('Distância Máxima até a Origem')}
              formattedValue={formatDistance(maxDistanceToOrigin)}
              description={t(
                'Defina em Km a distância máxima da posição atual até a origem do pedido que essa frota poderá percorrer. Pedidos recebidos com origem acima da definida não serão exibidos.'
              )}
            />
            <CustomSlider
              value={maxDistanceToOrigin}
              maximumValue={20000}
              step={500}
              onValueChange={setMaxDistanceToOrigin}
            />
            <FleetRule
              title={t('Porcentagem do Valor do Pedido')}
              formattedValue={formatPct(feePctOverValue)}
              description={t(
                'Defina um percentual do valor do pedido em restaurantes que será adicionado ao pagamento dessa frota.'
              )}
            />
            <CustomSlider
              value={feePctOverValue}
              maximumValue={20000}
              step={500}
              onValueChange={setFeePcTOverValue}
            />
            <FleetRule
              title={t('Valor Mínimo para Porcentagem')}
              formattedValue={formatCurrency(valueThreshold)}
              description={t(
                'Defina um valor mínimo do pedido em restaurantes para que se comece a cobrar a porcentagem definida acima.'
              )}
            />
            <CustomSlider
              value={valueThreshold}
              maximumValue={20000}
              step={500}
              onValueChange={setValueThreshold}
            />
          </View>
        </PaddedView>
        <FleetSummary
          minimumFee={minimumFee}
          distanceThreshold={distanceThreshold}
          maxDistance={maxDistance}
          maxDistanceToOrigin={maxDistanceToOrigin}
          feePctOverValue={feePctOverValue}
          valueThreshold={valueThreshold}
        />
        <View>
          <HR height={padding / 4} />
          <GainSimulator />
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
