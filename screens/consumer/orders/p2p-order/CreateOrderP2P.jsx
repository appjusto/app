import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native';
import { Marker } from 'react-native-maps';

import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import { getConsumerLocation } from '../../../../store/selectors/consumer';

import DefaultMap from '../../../common/DefaultMap';
import DefaultInput from '../../../common/DefaultInput';
import ShowIf from '../../../common/ShowIf';
import Touchable from '../../../common/Touchable';
import { screens } from '../../../common/styles';
import { pinUser } from '../../../../assets/icons';
import { t } from '../../../../strings';

export default function ({ navigation, route }) {
  // context
  const { params } = route;
  const locationPermission = useLocationUpdates(true);

  // state
  const currentLocation = useSelector(getConsumerLocation);
  const [step, setStep] = useState('origin');
  
  const [originAddress, setOriginAddress] = useState('');

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

  // UI
  return (
    <View style={style.screen}>
      <DefaultMap
        style={style.map}
        minZoomLevel={15}
        maxZoomLevel={15}
        fitToElements
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            icon={pinUser}
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
            title={t('originAddressTitle')}
            placeholder={t('addressPlaceholder')}
            onFocus={() => navigateToAddressComplete('originAddress')}
            onChangeText={() => navigateToAddressComplete('originAddress')}
          />
        </Touchable>
        <DefaultInput
          title={t('infoTitle')}
          placeholder={t('infoPlaceholder')}
        />
        <DefaultInput
          title={t('originInstructionsTitle')}
          placeholder={t('originInstructionsPlaceholder')}
        />
      </ShowIf>

      {/* destination */}
      <ShowIf test={step === 'destination'}>
        <DefaultInput
          title={t('destinationAddressTitle')}
          placeholder={t('addressPlaceholder')}
        />
        <DefaultInput
          title={t('infoTitle')}
          placeholder={t('infoPlaceholder')}
        />
        <DefaultInput
          title={t('originInstructionsTitle')}
          placeholder={t('originInstructionsPlaceholder')}
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