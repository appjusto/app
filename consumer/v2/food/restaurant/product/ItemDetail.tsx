import {
  Complement,
  ComplementGroup,
  OrderItem,
  OrderItemComplement,
  WithId
} from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';
import { ActivityIndicator, Image, Keyboard, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import HR from '../../../../../common/components/views/HR';
import { IconSemaphoreSmall } from '../../../../../common/icons/icon-semaphore-small';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { useProduct } from '../../../../../common/store/api/business/hooks/useProduct';
import { useProductImageURI } from '../../../../../common/store/api/business/hooks/useProductImageURI';
import { getNextAvailableDate } from '../../../../../common/store/api/business/selectors';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
import * as helpers from '../../../../../common/store/api/order/helpers';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import {
  getConsumer,
  getCurrentLocation,
  getCurrentPlace
} from '../../../../../common/store/consumer/selectors';
import {
  useContextBusiness,
  useContextBusinessId
} from '../../../../../common/store/context/business';
import {
  useContextGetComplementGroup,
  useContextGetProductCategory
} from '../../../../../common/store/context/menu';
import { useContextActiveOrder } from '../../../../../common/store/context/order';
import {
  borders,
  colors,
  halfPadding,
  padding,
  screens,
  texts
} from '../../../../../common/styles';
import { formatCurrency, formatHour } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';
import { RestaurantNavigatorParamList } from '../types';
import { useBusinessIsAcceptingOrders } from '../useBusinessIsAcceptingOrders';
import { ItemComplements } from './ItemComplements';
import { ItemQuantity } from './ItemQuantity';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RestaurantNavigatorParamList, 'ItemDetail'>,
  CompositeNavigationProp<
    StackNavigationProp<FoodOrderNavigatorParamList, 'RestaurantNavigator'>,
    StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
  >
>;
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
  const getProductCategory = useContextGetProductCategory();
  const getComplementGroup = useContextGetComplementGroup();
  // redux store
  const consumer = useSelector(getConsumer);
  const currentPlace = useSelector(getCurrentPlace);
  // state
  const location = useSelector(getCurrentLocation);
  const destination = activeOrder?.destination?.location ?? currentPlace?.location ?? location;
  const distance =
    destination && business?.businessAddress?.latlng
      ? distanceBetweenLatLng(destination, business.businessAddress.latlng)
      : 0;
  const distanceBetweenLocationAndDestination =
    location && destination ? distanceBetweenLatLng(location, destination) : 0;
  const isOutOfRange = (business?.deliveryRange ?? 0) < (distance ?? 0);
  const isAcceptingOrders = useBusinessIsAcceptingOrders(business);
  const product = useProduct(businessId, productId);
  const { data: imageURI } = useProductImageURI(businessId, productId, '1008x720');
  // screen state
  const [quantity, setQuantity] = React.useState(1);
  const [complements, setComplements] = React.useState<OrderItemComplement[]>([]);
  const [notes, setNotes] = React.useState<string>('');
  const orderItem = React.useMemo(() => {
    if (!product) return undefined;
    return {
      id: itemId ?? nanoid(),
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        categoryName: getProductCategory(product.id)?.name ?? '',
      },
      quantity,
      notes,
      complements,
    } as OrderItem;
  }, [product, itemId, quantity, notes, complements, getProductCategory]);
  const canAddItemToOrder = React.useMemo(() => {
    if (!product) return false;
    return helpers.hasSatisfiedAllGroups(product, complements);
  }, [product, complements]);
  // side effects
  // when product is loaded
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: business?.name ?? '',
    });
  }, [navigation, business]);
  // when editing order item
  React.useEffect(() => {
    if (!itemId) return;
    if (!activeOrder) return;
    if (!product) return;
    const item = activeOrder.items?.find((i) => i.id === itemId);
    if (!item) return;
    setComplements(item.complements ?? []);
    setQuantity(item.quantity);
    setNotes(item.notes ?? '');
  }, [itemId, activeOrder, product]);
  // tracking
  useSegmentScreen('ItemDetail');
  // UI
  if (!product || !business) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // helpers
  const addComplement = (group: WithId<ComplementGroup>, complement: WithId<Complement>) => {
    setComplements([
      ...complements,
      {
        name: complement.name,
        complementId: complement.id,
        price: complement.price,
        groupName: getComplementGroup(complement.id)?.name ?? '',
        group: {
          id: group.id,
          name: group.name,
        },
        quantity: 1,
      },
    ]);
  };
  const removeComplement = (complementId: string) => {
    setComplements(complements.filter((c) => c.complementId !== complementId));
  };
  const updateComplementQuantity = (complementId: string, delta: number) => {
    console.log('updateComplementQuantity', complementId, delta);
    const index = complements.findIndex((c) => c.complementId === complementId);
    const complement = complements[index];
    const quantity = complement.quantity + delta;
    if (quantity === 0) removeComplement(complementId);
    else {
      setComplements([
        ...complements.slice(0, index),
        { ...complement, quantity },
        ...complements.slice(index + 1),
      ]);
    }
  };
  // handlers
  const updateOrder = () => {
    (async () => {
      Keyboard.dismiss();
      if (!orderItem) return;
      if (!activeOrder) {
        console.log(
          `distanceBetweenLocationAndDestination: ${distanceBetweenLocationAndDestination}`
        );
        if (distanceBetweenLocationAndDestination > 2) {
          // showModaldestination
        }

        api.order().createFoodOrder(business, consumer!, [orderItem], currentPlace ?? null);
        track('consumer created food order in database');
      } else {
        const updatedOrder = !itemId
          ? helpers.addItemToOrder(activeOrder, orderItem)
          : quantity > 0
            ? helpers.updateItem(activeOrder, orderItem)
            : helpers.removeItem(activeOrder, orderItem);
        api.order().updateOrder(activeOrder.id, updatedOrder);
        track('consumer updated items in order');
      }

      navigation.pop();
    })();
  };
  // UI
  const getActionsUI = () => {
    if (!consumer) {
      return (
        <PaddedView>
          <DefaultButton
            title={t('Faça login para pedir')}
            onPress={() => navigation.replace('WelcomeScreen')}
          />
        </PaddedView>
      );
    }
    if (isOutOfRange)
      return (
        <View style={{ flex: 1, paddingBottom: padding }}>
          <View
            style={{
              margin: padding,
              paddingHorizontal: padding,
              paddingVertical: 24,
              alignItems: 'center',
              backgroundColor: colors.grey50,
              ...borders.default,
            }}
          >
            <IconSemaphoreSmall />
            <Text style={{ ...texts.sm, marginTop: halfPadding }}>
              {t('Restaurante fora da área de entrega')}
            </Text>
            <Text style={{ ...texts.xs, color: colors.grey700, textAlign: 'center' }}>
              {t(
                'Infelizmente ainda não atendemos seu endereço, mas você pode continuar explorando o cardápio'
              )}
            </Text>
          </View>
        </View>
      );
    if (isAcceptingOrders)
      return (
        <View style={{ flex: 1 }}>
          <ItemComplements
            product={product}
            getTotalComplements={(group: WithId<ComplementGroup>) =>
              helpers.totalComplements(group, complements)
            }
            getComplementQuantity={(complementId: string) =>
              complements.find((c) => c.complementId === complementId)?.quantity ?? 0
            }
            canAddComplement={(group) => helpers.canAddComplement(group, complements)}
            onComplementToggle={(group, complement, selected) => {
              console.log('onComplementToggle', helpers.canAddComplement(group, complements));
              if (!selected) removeComplement(complement.id);
              else if (helpers.canAddComplement(group, complements))
                addComplement(group, complement);
            }}
            onComplementIncrement={(complementId) => updateComplementQuantity(complementId, 1)}
            onComplementDecrement={(complementId) => updateComplementQuantity(complementId, -1)}
          />
          <HR style={{ marginTop: halfPadding }} />
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
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
              blurOnSubmit
              returnKeyType="done"
            />
          </View>
          <View style={{ flex: 1 }} />
        </View>
      );
    const nextOpeningDay = getNextAvailableDate(business.schedules, new Date());
    return (
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
        {nextOpeningDay ? (
          <>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>
              {`${t('Abriremos')} ${nextOpeningDay![0]} ${t('às')}`}
            </Text>
            <Text style={texts.x2l}>{formatHour(nextOpeningDay![1])}</Text>
          </>
        ) : null}
      </View>
    );
  };
  return (
    <View style={{ ...screens.default }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: padding,
              marginBottom: !isOutOfRange && isAcceptingOrders ? 24 : undefined,
            }}
          >
            {imageURI ? (
              <View style={{ width: '100%', height: 240, overflow: 'hidden' }}>
                <Image
                  source={{ uri: imageURI }}
                  style={{ width: '100%', height: 240 }}
                  borderRadius={8}
                  resizeMode="cover"
                />
              </View>
            ) : null}
            <View style={{ marginTop: padding }}>
              <Text style={{ ...texts.xl }}>{product?.name ?? ''}</Text>
              <Text style={{ ...texts.sm, color: colors.grey700, marginVertical: 4 }}>
                {product?.description ?? ''}
              </Text>
              <Text style={{ ...texts.sm }}>
                {product.complementsEnabled
                  ? `${t('A partir de ')} ${formatCurrency(product.price)}`
                  : formatCurrency(product.price)}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>{getActionsUI()}</View>
        </View>
      </KeyboardAwareScrollView>
      {!isOutOfRange && isAcceptingOrders ? (
        <View>
          <HR />
          <PaddedView>
            <ItemQuantity
              value={quantity}
              minimum={itemId ? 0 : 1}
              title={`${t('Adicionar')} ${formatCurrency(helpers.getItemTotal(orderItem!))}`}
              disabled={!canAddItemToOrder}
              onChange={(value) => setQuantity(value)}
              onSubmit={updateOrder}
            />
          </PaddedView>
        </View>
      ) : null}
    </View>
  );
};
