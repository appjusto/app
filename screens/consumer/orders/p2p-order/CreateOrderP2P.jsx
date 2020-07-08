import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Marker } from 'react-native-maps';
import { nanoid } from 'nanoid/non-secure';
import debounce from 'lodash/debounce';

import { ApiContext } from '../../../../store/api';
import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import { getConsumerLocation } from '../../../../store/selectors/consumer';

import DefaultMap from '../../../common/DefaultMap';
import DefaultInput from '../../../common/DefaultInput';
import ShowIf from '../../../common/ShowIf';
import { screens } from '../../../common/styles';
import { pinUser } from '../../../../assets/icons';
import { t } from '../../../../strings';

export default function () {
  // context
  const api = useContext(ApiContext);

  const locationPermission = useLocationUpdates(true);

  // state
  const currentLocation = useSelector(getConsumerLocation);
  const [step, setStep] = useState('origin');
  const [autocompleteSession, setAutocompleteSession] = useState(nanoid())
  const [originAddress, setOriginAddress] = useState('');

  // side effects
  const getAddress = useCallback(debounce((input) => {
    api.getAddressAutocomplete(input, autocompleteSession);
  }, 3000), []);

  useEffect(() => {
    if (originAddress.length > 9) {
      getAddress(originAddress, autocompleteSession);
    }
  }, [originAddress])

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
        <DefaultInput
          value={originAddress}
          title={t('originAddressTitle')}
          placeholder={t('addressPlaceholder')}
          onChangeText={setOriginAddress}
          blurOnSubmit
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