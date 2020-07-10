import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { Marker, Polyline } from 'react-native-maps';
import ViewPager from '@react-native-community/viewpager';
import polyline from '@mapbox/polyline';

import { ApiContext } from '../../../../store/api';
import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import { getConsumerLocation } from '../../../../store/selectors/consumer';

import DefaultMap from '../../../common/DefaultMap';
import DefaultInput from '../../../common/DefaultInput';
import DefaultButton from '../../../common/DefaultButton';
import Touchable from '../../../common/Touchable';
import { screens, borders } from '../../../common/styles';
import { pinUser, pinPackage } from '../../../../assets/icons';
import { t } from '../../../../strings';

export default function ({ navigation, route }) {
  // context
  const api = useContext(ApiContext);
  const { params } = route;
  const locationPermission = useLocationUpdates(true);

  // refs
  const viewPager = useRef();

  // state
  const currentLocation = useSelector(getConsumerLocation);
  const initialRegion = currentLocation ? {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : null;

  const [step, setStep] = useState(0);
  const [originAddress, setOriginAddress] = useState('');
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [order, setOrder] = useState(null);

  // handlers
  const navigateToAddressComplete = useCallback((field) => {
    navigation.navigate('AddressComplete', {
      originAddress,
      field,
      destinationScreen: 'CreateOrderP2P',
    })
  }, [originAddress])

  const nextStep = useCallback(() => {
    if (step === 2) {
      // TODO: place order
    }
    viewPager.current.setPage(step + 1);
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
      console.log(nativeEvent)
      console.log('done');
      // console.log(viewPager.current)
    }
  });
  
  // side effects
  // fires when AddressComplete finishes
  useEffect(() => {
    const { field } = params || {};
    if (field === 'originAddress') setOriginAddress(params[field]);
    else if (field === 'destinationAddress') setDestinationAddress(params[field]);
  }, [route.params]);

  useEffect(() => {
    const createOrder = async () => {
      const newOrder = await api.createOrder(originAddress, destinationAddress);
      // console.log(newOrder);
      const { directions } = newOrder;
      const { start_location, end_location } = directions;

      setOriginLocation({
        latitude: start_location.lat,
        longitude: start_location.lng,
      });
      setDestinationLocation({
        latitude: end_location.lat,
        longitude: end_location.lng,
      })
      setOrder(newOrder);
    }

    if (originAddress && destinationAddress) {
      createOrder();
    }
  }, [originAddress, destinationAddress]);

  // useEffect(() => {
  //   if (originAddress) {
  //     // api.googleGeocode(originAddress).then(setOriginLocation);
  //   }
  // }, [originAddress])

  // UI
  let nextStepTitle;
  if (step === 0) nextStepTitle = t('Confirmar local de retirada');
  else if (step === 1) nextStepTitle = t('Confirmar local de entrega');
  else if (step === 2) nextStepTitle = t('Fazer pedido');

  return (
    <View style={style.screen}>

      {/* Map */}
      <DefaultMap
        style={style.map}
        minZoomLevel={13}
        maxZoomLevel={13}
        initialRegion={initialRegion}
        fitToElements
      >
        {originLocation && (
          <Marker
            coordinate={originLocation}
            icon={pinPackage}
          />
        )}

        {destinationLocation && (
          <Marker
            coordinate={destinationLocation}
            icon={pinUser}
          />
        )}

        {order && (
          <Polyline coordinates={
            polyline.decode(order.directions.overview_polyline.points).map((pair) => {
              return { latitude: pair[0], longitude: pair[1] };
            })}
          />
        )}
      </DefaultMap>

      <View style={style.details}>
        <ViewPager
          ref={viewPager}
          style={{ flex: 1 }}
          onPageScroll={onPageScroll}
          onPageScrollStateChanged={onPageChanged}
        >
          {/* origin */}
          <View>
            <Touchable onPress={() => navigateToAddressComplete('originAddress')}>
              <DefaultInput
                style={style.input}
                value={originAddress}
                title={t('Endereço de retirada')}
                placeholder={t('Endereço com número')}
                onFocus={() => navigateToAddressComplete('originAddress')}
                onChangeText={() => navigateToAddressComplete('originAddress')}
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
              onPress={() => navigateToAddressComplete('destinationAddress')}
            >
              <DefaultInput
                style={style.input}
                value={destinationAddress}
                title={t('Endereço de entrega')}
                placeholder={t('Endereço com número')}
                onFocus={() => navigateToAddressComplete('destinationAddress')}
                onChangeText={() => navigateToAddressComplete('destinationAddress')}
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

          {/* summary */}
          <View>
            <Text>Summary</Text>
            {order && (
              <View>
                <Text>{t('Distância')}: {order.directions.distance.text}</Text>
                <Text>{t('Estimativa de duração')}: {order.directions.duration.text}</Text>
                <Text>{t('Valor da entrega R$')}: {order.fare.total}</Text>
              </View>
            )}
          </View>
        </ViewPager>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <DefaultButton
            style={{ width: '100%' }}
            title={nextStepTitle}
            onPress={nextStep}
          />
        </View>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const style = StyleSheet.create({
  screen: {
    ...screens.default,
  },
  map: {
    width,
    height: height * 0.3,
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