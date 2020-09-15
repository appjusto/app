import Slider from '@react-native-community/slider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, SliderProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import RoundedText from '../../../../common/components/texts/RoundedText';
import PaddedView from '../../../../common/components/views/PaddedView';
import { getCourier } from '../../../../common/store/courier/selectors';
import { createFleet } from '../../../../common/store/fleet/actions';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { texts, screens, colors, padding } from '../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
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
      thumbImage={icons.slider}
      {...props}
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
  const courier = useSelector(getCourier);

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
        valueThreshold: 0,
        feePctOverValue: 0,
        situation: 'approved',
        createdBy: courier?.id,
      })
    );
    navigation.goBack();
  };

  // UI
  return (
    <ScrollView>
      <PaddedView style={{ ...screens.configScreen }}>
        <Text style={{ ...texts.default, marginTop: 8, color: colors.darkGrey }}>
          {t('Sua frota ficará ativa depois que pelo menos 10 entregadores participarem dela.')}
        </Text>
        <DefaultInput
          ref={nameRef}
          title={t('Nome')}
          placeholder={t('Nome com no máximo 30 caracteres')}
          value={name}
          returnKeyType="next"
          blurOnSubmit={false}
          maxLength={30}
          onChangeText={setName}
          onSubmitEditing={() => descriptionRef.current?.focus()}
          keyboardType="default"
        />
        <DefaultInput
          ref={descriptionRef}
          title={t('Descrição')}
          placeholder={t('Descreva sua frota em até 280 caracteres')}
          value={description}
          returnKeyType="next"
          blurOnSubmit={false}
          maxLength={280}
          numberOfLines={3}
          onChangeText={setDescription}
          keyboardType="default"
        />
        <View>
          <View style={{ marginTop: padding }}>
            <Text style={[texts.big]}>{t('Tarifa base')}</Text>
            <Text style={{ ...texts.default, marginTop: 8, color: colors.darkGrey }}>
              {t(
                'A tarifa base é composta por um valor mínimo e uma distância de atendimento. A partir dessa distância, você ganhará um adicional por km ou fração.'
              )}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: padding }}>
            <Text style={{ ...texts.medium }}>{t('Distância base: ')}</Text>
            <RoundedText>{formatDistance(distanceThreshold)}</RoundedText>
          </View>
          <CustomSlider
            value={distanceThreshold}
            maximumValue={5000}
            step={500}
            onValueChange={setDistanceThreshold}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: padding,
            }}
          >
            <Text style={{ ...texts.medium }}>{t('Valor para corridas até')} </Text>
            <RoundedText>{`${formatDistance(distanceThreshold)}`}</RoundedText>
            <Text style={{ ...texts.medium }}>{t(' é de ')}</Text>
            <RoundedText>{`${formatCurrency(minimumFee)}`}</RoundedText>
          </View>
          <CustomSlider
            value={minimumFee}
            minimumValue={100}
            maximumValue={3000}
            step={50}
            onValueChange={setMinimumFee}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: padding,
            }}
          >
            <Text style={{ ...texts.medium }}>{`${t('A partir de')} ${formatDistance(
              distanceThreshold
            )} ${t(', o valor adicional por km é de:')}`}</Text>
            <RoundedText>{`${formatCurrency(additionalPerKmAfterThreshold)}`}</RoundedText>
          </View>
          <CustomSlider
            value={additionalPerKmAfterThreshold}
            minimumValue={100}
            maximumValue={3000}
            step={50}
            onValueChange={setAdditionalPerKmAfterThreshold}
          />
          <View style={{ marginTop: padding }}>
            <Text style={[texts.big]}>{t('Limites')}</Text>
            <Text style={{ ...texts.default, marginTop: 8, color: colors.darkGrey }}>
              {t('Defina as distâncias máximas até o ponto de coleta e do trajeto.')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ ...texts.medium }}>{t('Distância máxima até o ponto de coleta: ')}</Text>
            <RoundedText>{formatDistance(maxDistanceToOrigin)}</RoundedText>
          </View>
          <CustomSlider
            value={maxDistanceToOrigin}
            maximumValue={20000}
            step={500}
            onValueChange={setMaxDistanceToOrigin}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ ...texts.medium }}>{t('Distância máxima até a entrega: ')}</Text>
            <RoundedText>{formatDistance(maxDistance)}</RoundedText>
          </View>
          <CustomSlider
            value={maxDistance}
            maximumValue={20000}
            step={500}
            onValueChange={setMaxDistance}
          />
        </View>
        <DefaultButton
          style={{ marginTop: padding * 2 }}
          title={t('Confirmar')}
          onPress={createFleetHandler}
          disabled={!canSubmit || busy}
          activityIndicator={busy}
        />
      </PaddedView>
    </ScrollView>
  );
}
