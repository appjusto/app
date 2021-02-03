import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Complement, WithId } from 'appjusto-types';
import { OrderItem } from 'appjusto-types/order/item';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../../common/app/context';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import { useProduct } from '../../../../../common/store/api/business/hooks/useProduct';
import * as helpers from '../../../../../common/store/api/order/helpers';
import { getConsumer, getCurrentPlace } from '../../../../../common/store/consumer/selectors';
import {
  useContextBusiness,
  useContextBusinessId,
} from '../../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import * as fake from '../../fakeData';
import { RestaurantNavigatorParamList } from '../types';
import { ItemComplements } from './ItemComplements';
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
  const business = useContextBusiness();
  const activeOrder = useContextActiveOrder();
  // redux store
  const consumer = useSelector(getConsumer)!;
  const currentPlace = useSelector(getCurrentPlace);
  // screen state
  const product = useProduct(useContextBusinessId(), productId);
  const [quantity, setQuantity] = React.useState(1);
  const [complements, setComplements] = React.useState<WithId<Complement>[]>([]);
  const [notes, setNotes] = React.useState<string>('');
  const orderItem = React.useMemo(() => {
    if (!product) return undefined;
    return {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
      quantity,
      notes,
      complements: complements.map((complement) => ({
        complementId: complement.id,
        price: complement.price,
      })),
    } as OrderItem;
  }, [product, quantity, notes, complements]);
  const canAddItemToOrder = React.useMemo(() => {
    if (!product) return false;
    return helpers.hasSatisfiedAllGroups(product, complements);
  }, [product, complements]);
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
  const addItemToOrder = () => {
    (async () => {
      if (!orderItem) return;
      if (!activeOrder) {
        api.order().createFoodOrder(business, consumer, [orderItem], currentPlace ?? null);
      } else {
        api.order().updateFoodOrder(activeOrder.id, helpers.addItemToOrder(activeOrder, orderItem));
      }
      navigation.pop();
    })();
  };
  // UI
  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ paddingHorizontal: 12 }}>
        <Image source={fake.detail} style={{ width: '100%', height: 240, borderRadius: 8 }} />
        <View style={{ marginTop: padding }}>
          <Text style={{ ...texts.mediumToBig }}>{product?.name ?? ''}</Text>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginVertical: 4 }}>
            {product?.description ?? ''}
          </Text>
          <Text style={{ ...texts.default }}>{formatCurrency(product?.price ?? 0)}</Text>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          borderColor: colors.grey,
          marginTop: 24,
          marginBottom: halfPadding,
        }}
      />
      <ItemComplements
        product={product}
        selectedComplements={complements}
        onComplementToggle={(group, complement, selected) => {
          if (!selected || helpers.canAddComplement(group, complements)) {
            if (selected) setComplements([...complements, complement]);
            else setComplements(complements.filter((c) => c.id !== complement.id));
          }
        }}
      />
      <View style={{ paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: halfPadding }}>
          <Feather name="info" size={14} />
          <Text style={{ ...texts.default, marginLeft: 4 }}>{t('Informações adicionais')}</Text>
        </View>
        <DefaultInput
          placeholder={t(
            'Tem alguma observação? Por exemplo: sem molho, sem cebola, ponto da carne, etc'
          )}
          multiline
          numberOfLines={6} // How much is enough?
          value={notes}
          onChangeText={setNotes}
          style={{ height: 96, marginTop: halfPadding }}
        />
      </View>
      {/* <View style={{ flex: 1 }} /> */}
      <View
        style={{
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          borderColor: colors.grey,
          marginTop: 24,
          marginBottom: halfPadding,
        }}
      />
      {orderItem && (
        <View style={{ paddingHorizontal: 12 }}>
          <ItemQuantity
            value={quantity}
            title={`${t('Adicionar')} ${formatCurrency(helpers.getItemTotal(orderItem!))}`}
            disabled={!canAddItemToOrder}
            onChange={(value) => setQuantity(value)}
            onSubmit={addItemToOrder}
          />
        </View>
      )}
    </ScrollView>
  );
}
