import { Business, WithId } from '@appjusto/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
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
  const { allBusinessesManaged } = React.useContext(BusinessAppContext);
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
  const selectBusinessHandler = async () => {
    try {
      if (selectedBusiness) {
        setLoading(true);
        await AsyncStorage.setItem('last-business-id', selectedBusiness.id);
        setLoading(false);
        navigation.navigate('BusinessOrders', { businessId: selectedBusiness.id });
      } else dispatch(showToast(t('Escolha um restaurante para prosseguir'), 'error'));
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
  if (allBusinessesManaged === undefined || selectedBusiness === undefined) {
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
        {allBusinessesManaged.map((business) => {
          return (
            <View style={{ marginBottom: padding }} key={business.id}>
              <SelectBusinessCard
                business={business}
                selected={selectedBusiness && selectedBusiness.id === business.id}
                onSelectBusiness={() => setSelectedBusiness(business)}
              />
            </View>
          );
        })}
      </ScrollView>
      <PaddedView>
        <DefaultButton
          title={t('Confirmar')}
          style={{ marginBottom: padding }}
          activityIndicator={loading}
          disabled={loading || selectedBusiness === undefined}
          onPress={selectBusinessHandler}
        />
      </PaddedView>
    </View>
  );
};
