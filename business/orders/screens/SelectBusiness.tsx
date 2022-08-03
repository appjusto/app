import { Business, WithId } from '@appjusto/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessAppContext } from '../../BusinessAppContext';
import { BusinessNavParamsList } from '../../types';
import { SelectBusinessCard } from '../components/SelectBusinessCard';

type ScreenNavigationProp = StackNavigationProp<BusinessNavParamsList, 'SelectBusiness'>;
type ScreenRouteProp = RouteProp<BusinessNavParamsList, 'SelectBusiness'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const SelectBusiness = ({ navigation, route }: Props) => {
  // route params
  const { businessId } = route.params ?? {};
  // context
  const { businesses, selectBusinessId } = React.useContext(BusinessAppContext);
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const [selectedBusiness, setSelectedBusiness] = React.useState<WithId<Business>>();
  const [loading, setLoading] = React.useState(false);
  // side-effects
  // getting business id from BusinessOrders and setting this business as selected
  React.useEffect(() => {
    if (businessId?.length) {
      return api.business().observeBusiness(businessId, setSelectedBusiness);
    }
  }, [businessId, api]);
  // handlers
  const selectBusinessHandler = async (business: WithId<Business>) => {
    try {
      setSelectedBusiness(business);
      setLoading(true);
      await AsyncStorage.setItem('last-business-id', business.id);
      selectBusinessId(business.id);
      setLoading(false);
      navigation.navigate('BusinessOrders', { businessId: business.id });
    } catch (error: any) {
      setLoading(false);
      console.log(error.toString());
      dispatch(
        showToast(
          t('Não foi possível trocar o restaurante nesse momento. Tente novamente'),
          'error'
        )
      );
    }
  };
  //UI
  if (businesses === undefined || selectedBusiness === undefined) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <View style={{ ...screens.config }}>
      <ScrollView
        style={{ ...screens.config, padding }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {businesses.map((business) => {
          return (
            <View style={{ marginBottom: padding }} key={business.id}>
              <SelectBusinessCard
                business={business}
                selected={selectedBusiness && selectedBusiness.id === business.id}
                onSelectBusiness={() => selectBusinessHandler(business)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
