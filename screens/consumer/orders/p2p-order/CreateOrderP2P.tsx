import React, { useState, useContext, useCallback, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import ViewPager from '@react-native-community/viewpager';

import { Place } from '../../../../store/types';
import Api, { ApiContext } from '../../../../store/api';
import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import { getConsumerLocation } from '../../../../store/selectors/consumer';

import DefaultInput from '../../../common/DefaultInput';
import DefaultButton from '../../../common/DefaultButton';
import Touchable from '../../../common/Touchable';
import { screens, borders } from '../../../common/styles';
import { motocycle } from '../../../../assets/icons';
import OrderMap from './OrderMap';
import { t } from '../../../../strings';

enum Steps {
  Origin = 0,
  Destination,
  Confirmation
}

export default function ({ navigation, route }) {
  // context
  const api = useContext(ApiContext) as Api;
  const { params } = route;
  const locationPermission = useLocationUpdates(true);

  // refs
  const viewPager = useRef<ViewPager>();

  // state
  const currentLocation = useSelector(getConsumerLocation);
  const initialRegion = currentLocation ? {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : null;

  const [step, setStep] = useState(Steps.Origin);
  const [origin, setOrigin] = useState({} as Place);
  const [destination, setDestination] = useState({} as Place);
  const [order, setOrder] = useState(null);

  // handlers
  // navigate to address complete screen
  const navigateToAddressComplete = useCallback(() => {
    const value = step === Steps.Origin ? origin.address : destination.address;
    const destinationParam = step === Steps.Origin ? 'originAddress' : 'destinationAddress';
    navigation.navigate('AddressComplete', {
      value,
      destinationScreen: 'CreateOrderP2P',
      destinationParam,
    })
  }, [step])

  // navigation between steps
  const nextPage = useCallback(() => {
    if (viewPager && viewPager.current) viewPager.current.setPage(step + 1)
  }, [viewPager, step]);

  const nextStep = useCallback(() => {
    if (!origin) return;
    if (step >= 1 && !destination) return;
    if (step < 2) nextPage();
    else if (order) {
      // TODO: place order
    }
  }, [step]);

  const onPageScroll = useCallback((ev) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    
    if (position !== step) {
      setStep(position);
    }
  }, [step]);

  const onPageChanged = useCallback((ev) => {
    const { nativeEvent } = ev;
    const { pageScrollState } = nativeEvent;
    if (pageScrollState === 'idle') {
      // console.log(viewPager.current)
    }
  }, []);
  
  // side effects
  // fires when AddressComplete finishes
  useEffect(() => {
    const { originAddress, destinationAddress } = params || {};
    if (originAddress) setOrigin({...origin, address: originAddress});
    if (destinationAddress) setDestination({...destination, address: destinationAddress});
  }, [route.params]);

  useEffect(() => {
    const createOrder = async () => {
      const newOrder = await api.createOrder(origin, destination);
      console.log(newOrder);
      setOrder(newOrder);
    }

    if (origin.address && destination.address) {
      createOrder();
    }
  }, [origin.address, destination.address]);

  // UI
  let nextStepTitle;
  if (step === 0) nextStepTitle = t('Confirmar local de retirada');
  else if (step === 1) nextStepTitle = t('Confirmar local de entrega');
  else if (step === 2) nextStepTitle = t('Fazer pedido');

  return (
    <View style={style.screen}>

      {/* header */}

      {step < 2 && (
        <Image source={motocycle} />
      )}

      {/* confirmation step */}
      {step === 2 && (
        <OrderMap initialRegion={initialRegion} order={order} />
      )}

      <View style={style.details}>
        {/* progress */}

        {/* content */}
        <ViewPager
          ref={viewPager}
          style={{ flex: 1 }}
          onPageScroll={onPageScroll}
          onPageScrollStateChanged={onPageChanged}
        >
          {/* origin */}
          <View>
            <Touchable onPress={navigateToAddressComplete}>
              <DefaultInput
                style={style.input}
                value={origin.address}
                title={t('Endereço de retirada')}
                placeholder={t('Endereço com número')}
                onFocus={navigateToAddressComplete}
                onChangeText={navigateToAddressComplete}
              />
            </Touchable>

            <DefaultInput
              style={style.input}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
            />

            <DefaultInput
              style={style.input}
              title={t('Instruções de retirada')}
              placeholder={t('Informe com quem e o quê deve ser retirado')}
            />
          </View>

          {/* destination */}
          <View>
            <Touchable
              onPress={navigateToAddressComplete}
            >
              <DefaultInput
                style={style.input}
                value={destination.address}
                title={t('Endereço de entrega')}
                placeholder={t('Endereço com número')}
                onFocus={navigateToAddressComplete}
                onChangeText={navigateToAddressComplete}
              />
            </Touchable>

            <DefaultInput
              style={style.input}
              title={t('Complemento (se houver)')}
              placeholder={t('Apartamento, sala, loja, etc.')}
            />

            <DefaultInput
              style={style.input}
              title={t('Instruções para entrega')}
              placeholder={t('Informe para quem deve ser entregue')}
            />
          </View>

          
          <View>
            <Text>Summary</Text>
            {order && (
              <View>
                <Text>{t('Distância')}: {order.distance.text}</Text>
                <Text>{t('Estimativa de duração')}: {order.duration.text}</Text>
                <Text>{t('Valor da entrega R$')}: {order.fare.total}</Text>
              </View>
            )}
          </View>
        </ViewPager>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <DefaultButton
            styleObject={{ width: '100%' }}
            title={nextStepTitle}
            onPress={nextStep}
          />
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  screen: {
    ...screens.default,
  },
  details: {
    flex: 1,
    padding: 16,
    ...borders.default,
  },
  input: {
    marginTop: 12,
  },
});