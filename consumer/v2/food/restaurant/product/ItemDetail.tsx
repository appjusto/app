import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Complement, WithId } from 'appjusto-types';
import { OrderItem } from 'appjusto-types/order/item';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../../common/app/context';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import HR from '../../../../../common/components/views/HR';
import { useProduct } from '../../../../../common/store/api/business/hooks/useProduct';
import { useProductImageURI } from '../../../../../common/store/api/business/hooks/useProductImageURI';
import * as helpers from '../../../../../common/store/api/order/helpers';
import { getConsumer, getCurrentPlace } from '../../../../../common/store/consumer/selectors';
import {
  useContextBusiness,
  useContextBusinessId,
} from '../../../../../common/store/context/business';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import {
  borders,
  colors,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { RestaurantNavigatorParamList } from '../types';
import { ItemComplements } from './ItemComplements';
import { ItemQuantity } from './ItemQuantity';

type ScreenNavigationProp = StackNavigationProp<RestaurantNavigatorParamList>;
type ScreenRouteProp = RouteProp<RestaurantNavigatorParamList, 'ItemDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ItemDetail = ({ navigation, route }: Props) => {
  // params
  const { productId, itemId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const business = useContextBusiness();
  const businessId = useContextBusinessId();
  const activeOrder = useContextActiveOrder();
  // redux store
  const consumer = useSelector(getConsumer)!;
  const currentPlace = useSelector(getCurrentPlace);
  // screen state
  const product = useProduct(businessId, productId);
  const { data: imageURI } = useProductImageURI(businessId, productId, '1008x720');
  const [quantity, setQuantity] = React.useState(1);
  const [complements, setComplements] = React.useState<WithId<Complement>[]>([]);
  const [notes, setNotes] = React.useState<string>('');
  const orderItem = React.useMemo(() => {
    if (!product) return undefined;
    return {
      id: itemId ?? nanoid(),
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
      quantity,
      notes,
      complements: complements.map((complement) => ({
        name: complement.name,
        complementId: complement.id,
        price: complement.price,
      })),
    } as OrderItem;
  }, [product, itemId, quantity, notes, complements]);
  const canAddItemToOrder = React.useMemo(() => {
    if (!product) return false;
    return helpers.hasSatisfiedAllGroups(product, complements);
  }, [product, complements]);
  // side effects
  // when product is loaded
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: product?.name ?? '',
    });
  }, [navigation, product]);
  // when editing order item
  React.useEffect(() => {
    if (!itemId) return;
    if (!activeOrder) return;
    if (!product) return;
    const item = activeOrder.items?.find((i) => i.id === itemId);
    if (!item) return;
    // get ids of added complements
    const complementsIds = item.complements?.map((complement) => complement.complementId) ?? [];
    // get complements from product using ids
    const itemComplements = (product.complementsGroups ?? []).reduce<WithId<Complement>[]>(
      (result, group) => {
        return [...result, ...(group.items ?? []).filter((c) => complementsIds.includes(c.id))];
      },
      []
    );
    setComplements(itemComplements);
    setQuantity(item.quantity);
    setNotes(item.notes ?? '');
  }, [itemId, activeOrder, product]);
  // UI
  if (!product) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
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
        const updatedOrder = !itemId
          ? helpers.addItemToOrder(activeOrder, orderItem)
          : quantity > 0
          ? helpers.updateItem(activeOrder, orderItem)
          : helpers.removeItem(activeOrder, orderItem);
        api.order().updateOrder(activeOrder.id, updatedOrder);
      }
      navigation.pop();
    })();
  };
  // UI
  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ paddingHorizontal: padding, marginBottom: halfPadding }}>
        <View style={{ width: '100%', height: 240, overflow: 'hidden' }}>
          {imageURI && (
            <Image
              source={{ uri: imageURI }}
              style={{ width: '100%', height: 240 }}
              borderRadius={8}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={{ marginTop: padding }}>
          <Text style={{ ...texts.xl }}>{product?.name ?? ''}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700, marginVertical: 4 }}>
            {product?.description ?? ''}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(product?.price ?? 0)}</Text>
        </View>
      </View>

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
      {business.status === 'open' && (
        <View style={{ marginTop: 26 }}>
          <HR />
          <View style={{ padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="info" size={14} />
              <Text style={{ ...texts.sm, marginLeft: 4 }}>{t('Informações adicionais')}</Text>
            </View>
            <DefaultInput
              style={{ height: 96, marginTop: halfPadding }}
              placeholder={t(
                'Tem alguma observação? Por exemplo: sem molho, sem cebola, ponto da carne, etc'
              )}
              multiline
              numberOfLines={6}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          <HR />
          <View style={{ paddingHorizontal: 12 }}>
            <ItemQuantity
              style={{ marginVertical: padding }}
              value={quantity}
              minimum={itemId ? 0 : 1}
              title={`${t('Adicionar')} ${formatCurrency(helpers.getItemTotal(orderItem!))}`}
              disabled={!canAddItemToOrder}
              onChange={(value) => setQuantity(value)}
              onSubmit={addItemToOrder}
            />
          </View>
        </View>
      )}
      {business.status === 'closed' && (
        <View
          style={{
            margin: padding,
            padding: 25,
            alignItems: 'center',
            backgroundColor: colors.grey50,
            ...borders.default,
          }}
        >
          <Feather name="clock" size={26} />
          <Text style={texts.sm}>{t('Desculpe, estamos fechados agora')}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t('Abriremos {amanhã, dia da semana} às')}
          </Text>
          <Text style={texts.x2l}>{t('00:00')}</Text>
        </View>
      )}
    </ScrollView>
  );
};
