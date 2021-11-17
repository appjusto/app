import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import useLastKnownLocation from '../../../../common/location/useLastKnownLocation';
import { getCurrentPlace } from '../../../../common/store/consumer/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { borders, colors, halfPadding, texts } from '../../../../common/styles';
import { formatAddress } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  onChangePlace: () => void;
};

export const LocationBar = ({ onChangePlace }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const currentPlace = useSelector(getCurrentPlace);
  // state
  const { coords } = useLastKnownLocation();
  // screen state
  const [address, setAddress] = React.useState(
    currentPlace?.address ? formatAddress(currentPlace.address) : ''
  );
  const [loading, setLoading] = React.useState(false);
  // handler
  const updateLocationHandler = async () => {
    if (!coords) {
      dispatch(
        showToast(t('Não foi possível realizar a operação. Tente novamente mais tarde'), 'error')
      );
      return;
    }
    try {
      setLoading(true);
      const lastKnownAddress = await api.maps().googleReverseGeocode(coords);
      console.log(lastKnownAddress);
      setAddress(formatAddress(lastKnownAddress!));
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      dispatch(showToast(error.toString(), 'error'));
    }
  };
  // UI
  return (
    <View
      style={{
        ...borders.default,
        backgroundColor: colors.grey50,
        width: '100%',
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 32,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={updateLocationHandler}>
          <MaterialIcons name="gps-fixed" size={16} />
        </TouchableOpacity>
        <View style={{ width: '80%', marginLeft: halfPadding }}>
          <Text style={{ ...texts.xs, flexWrap: 'wrap' }}>{address}</Text>
        </View>
      </View>
      <TouchableOpacity style={{ alignItems: 'flex-end' }} onPress={onChangePlace}>
        <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Trocar')}</Text>
      </TouchableOpacity>
    </View>
  );
};
