import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import useLastKnownLocation from '../../../../common/location/useLastKnownLocation';
import { updateCurrentPlace } from '../../../../common/store/consumer/actions';
import { getCurrentPlace } from '../../../../common/store/consumer/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { borders, colors, doublePadding, halfPadding, texts } from '../../../../common/styles';
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
  const [loading, setLoading] = React.useState(false);
  // handler
  const changeToCurrentLocationHandler = async () => {
    try {
      setLoading(true);
      const address = await api.maps().googleReverseGeocode(coords!);
      if (address) {
        dispatch(
          updateCurrentPlace({
            address,
          })
        );
      } else {
        dispatch(
          showToast(
            t('Não foi possível realizar a operação agora. Tente novamente mais tarde'),
            'error'
          )
        );
      }
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
        <TouchableOpacity onPress={changeToCurrentLocationHandler}>
          <View style={{ height: '100%', justifyContent: 'center' }}>
            <MaterialIcons name="gps-fixed" size={16} />
          </View>
        </TouchableOpacity>
        <View style={{ width: '80%', marginLeft: halfPadding }}>
          {loading ? (
            <View style={{ marginLeft: doublePadding }}>
              <ActivityIndicator size="small" color={colors.green500} />
            </View>
          ) : (
            <Text style={{ ...texts.xs, flexWrap: 'wrap' }}>
              {currentPlace?.address ? formatAddress(currentPlace.address) : ''}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'flex-end',
          height: '100%',
          justifyContent: 'center',
        }}
        onPress={onChangePlace}
      >
        <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Trocar')}</Text>
      </TouchableOpacity>
    </View>
  );
};
