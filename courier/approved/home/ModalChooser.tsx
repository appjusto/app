import { CourierMode } from 'appjusto-types/courier';
import React, { useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../common/app/context';
import IconButton from '../../../common/components/buttons/IconButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { getCourier, getCourierMode } from '../../../common/store/courier/selectors';
import { updateProfile } from '../../../common/store/user/actions';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

export default function () {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const courier = useSelector(getCourier)!;
  const mode = useSelector(getCourierMode);

  // handlers
  const modeChangeHandler = useCallback((value: CourierMode) => {
    dispatch(updateProfile(api)(courier.id, { mode: value }));
  }, []);

  // UI
  return (
    <PaddedView
      style={{ ...borders.default, backgroundColor: colors.white, borderColor: colors.lightGrey }}
    >
      <Text style={texts.medium}>{t('Método de entrega de hoje: ')}</Text>
      <View style={{ marginTop: padding, flexDirection: 'row', justifyContent: 'space-between' }}>
        <IconButton
          title={t('Moto')}
          active={mode === 'motocycle'}
          onPress={() => modeChangeHandler('motocycle')}
        />
        <IconButton
          title={t('Bicicleta')}
          active={mode === 'bicycle'}
          onPress={() => modeChangeHandler('bicycle')}
        />
        <IconButton
          title={t('Patinete')}
          active={mode === 'scooter'}
          onPress={() => modeChangeHandler('scooter')}
        />
        <IconButton
          title={t('Carro')}
          active={mode === 'car'}
          onPress={() => modeChangeHandler('car')}
        />
        <IconButton
          title={t('A pé')}
          active={mode === 'walking'}
          onPress={() => modeChangeHandler('walking')}
        />
      </View>
    </PaddedView>
  );
}
