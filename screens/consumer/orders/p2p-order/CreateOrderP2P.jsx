import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Marker } from 'react-native-maps';

import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import { getConsumerLocation } from '../../../../store/selectors/consumer';

import DefaultMap from '../../../common/DefaultMap';
import DefaultInput from '../../../common/DefaultInput';
import ShowIf from '../../../common/ShowIf';
import Touchable from '../../../common/Touchable';
import { screens } from '../../../common/styles';
import { pinUser, pinPackage } from '../../../../assets/icons';
import { t } from '../../../../strings';
import { ApiContext } from '../../../../store/api';

export default function ({ navigation, route }) {
  // context
  const api = useContext(ApiContext);
  const { params } = route;
  const locationPermission = useLocationUpdates(true);

  // state
  const currentLocation = useSelector(getConsumerLocation);
  const initialRegion = currentLocation ? {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : null;

  const [step, setStep] = useState('origin');
  const [originAddress, setOriginAddress] = useState('');
  const [originLocation, setOriginLocation] = useState(null);

  // handlers
  const navigateToAddressComplete = useCallback((field) => {
    navigation.navigate('AddressComplete', {
      originAddress,
      field,
      destinationScreen: 'CreateOrderP2P',
    })
  }, [originAddress])
  
  // side effects
  useEffect(() => {
    const { field } = params || {};
    if (field === 'originAddress') setOriginAddress(params[field]);
  }, [route.params]);

  useEffect(() => {
    if (originAddress) {
      // Location.geocodeAsync(originAddress).then((locations) => setOriginLocation(locations[0]));
      api.googleGeocode(originAddress).then(setOriginLocation);
    }
  }, [originAddress])

  // UI
  return (
    <View style={style.screen}>
    <DefaultMap
        style={style.map}
        minZoomLevel={13}
        maxZoomLevel={13}
        initialRegion={initialRegion}
        fitToElements
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            icon={pinUser}
          />
        )}

        {originLocation && (
          <Marker
            coordinate={originLocation}
            icon={pinPackage}
          />
        )}
      </DefaultMap>

      {/* origin */}
      <ShowIf test={step === 'origin'}>
        <Touchable
          onPress={() => navigateToAddressComplete('originAddress')}
        >
          <DefaultInput
            value={originAddress}
            title={t('Endereço de retirada')}
            placeholder={t('Endereço com número')}
            onFocus={() => navigateToAddressComplete('originAddress')}
            onChangeText={() => navigateToAddressComplete('originAddress')}
          />
        </Touchable>

        <DefaultInput
          title={t('Complemento (se houver)')}
          placeholder={t('Apartamento, sala, loja, etc.')}
        />

        <DefaultInput
          title={t('Instruções de retirada')}
          placeholder={t('Informe com quem e o quê deve ser retirado')}
        />


      </ShowIf>

      {/* destination */}
      <ShowIf test={step === 'destination'}>
        <DefaultInput
          title={t('Endereço de entrega')}
          placeholder={t('addressPlaceholder')}
        />
        <DefaultInput
          title={t('Complemento (se houver)')}
          placeholder={t('Apartamento, sala, loja, etc.')}
        />
        <DefaultInput
          title={t('Instruções para entrega')}
          placeholder={t('Informe para quem deve ser entregue')}
        />
      </ShowIf>
      
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
  }
});