import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderItem } from 'appjusto-types/order/item';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../../common/app/context';
import GrayLine from '../../../../../common/components/views/GrayLine';
import { useProduct } from '../../../../../common/store/api/business/hooks/products';
import * as helpers from '../../../../../common/store/api/order/helpers';
import { useContextBusinessId } from '../../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { getUser } from '../../../../../common/store/user/selectors';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import AddInfo from '../../components/AddInfo';
import * as fake from '../../fakeData';
import { RestaurantNavigatorParamList } from '../types';
import { ItemQuantity } from './ItemQuantity';

type ScreenNavigationProp = StackNavigationProp<RestaurantNavigatorParamList>;
type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'ItemDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { productId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const businessId = useContextBusinessId();
  const activeOrder = useContextActiveOrder();
  // redux store
  const user = useSelector(getUser)!;
  // screen state
  const product = useProduct(useContextBusinessId(), productId);
  const [notes, setNotes] = React.useState<string>('');
  // side effects
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: product?.name ?? '',
    });
  }, [product]);
  // UI
  if (!product) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  // handlers
  const changeQuantityHandler = (value: number) => {
    (async () => {
      console.log('changeQuantityHandler', activeOrder?.id);
      const item: OrderItem = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
        quantity: value,
        notes,
      };
      if (!activeOrder) api.order().createFoodOrder(businessId, user.uid, [item]);
      else api.order().updateFoodOrder(activeOrder.id, helpers.addItemToOrder(activeOrder, item));
      navigation.pop();
    })();
  };
  // UI
  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ paddingHorizontal: padding, marginBottom: 24 }}>
        <Image source={fake.detail} style={{ width: '100%', height: 240, borderRadius: 8 }} />
        <View style={{ marginTop: padding }}>
          <Text style={{ ...texts.mediumToBig }}>{product?.name ?? ''}</Text>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginVertical: 4 }}>
            {product?.description ?? ''}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(product?.price ?? 0)}</Text>
        </View>
      </View>
      <GrayLine />
      <AddInfo value={notes} onAddInfo={setNotes} />
      {/* <View style={{ flex: 1 }} /> */}
      <GrayLine />
      <View style={{ paddingHorizontal: padding }}>
        <ItemQuantity
          onChange={changeQuantityHandler}
          getPrice={(quantity) => formatCurrency(product.price * quantity)}
        />
      </View>
    </ScrollView>
  );
}
