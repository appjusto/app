import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

import * as icons from '../../../../assets/icons';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/views/PaddedView';
import ShowIf from '../../../../common/components/views/ShowIf';
import { Card } from '../../../../common/store/consumer/types';
import OrderImpl from '../../../../common/store/order/types/OrderImpl';
import { texts, colors, borders, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import OrderMap from './OrderMap';
import PlaceSummary from './PlaceSummary';

type Props = {
  order: OrderImpl;
  card: Card | null;
  waiting: boolean;
  editStepHandler: (index: number) => void;
  nextStepHandler: () => void;
  navigateToFillPaymentInfo: () => void;
};

export default function ({
  order,
  card,
  waiting,
  editStepHandler,
  nextStepHandler,
  navigateToFillPaymentInfo,
}: Props) {
  const { height } = Dimensions.get('window');
  const { origin, destination, distance, duration, fare } = order.getData();
  return (
    <ScrollView style={{ flex: 1 }}>
      {/* show map if it was hidden on previous pages */}
      <ShowIf test={height < 700}>
        {() => (
          <View style={{ height: 160 }}>
            <OrderMap order={order.getData()} />
          </View>
        )}
      </ShowIf>
      <View style={{ flex: 1 }}>
        {/* origin and destionatin */}
        <PaddedView>
          <PlaceSummary
            title={t('Retirada')}
            place={origin}
            editStepHandler={() => editStepHandler(0)}
          />
          <PlaceSummary
            title={t('Entrega')}
            place={destination}
            editStepHandler={() => editStepHandler(1)}
          />
        </PaddedView>

        {/* details */}
        <PaddedView>
          <View
            style={{
              ...borders.default,
              paddingHorizontal: 8,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <Text>{distance}</Text>
            <Text>{duration}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 16,
              justifyContent: 'space-between',
              height: 60,
              width: '100%',
            }}
          >
            <Text style={{ ...texts.medium, lineHeight: 22 }}>{t('Valor total a pagar')}</Text>
            <Text style={{ ...texts.medium, lineHeight: 22 }}>R$ {fare.total}</Text>
          </View>
        </PaddedView>
      </View>

      <View style={{ ...screens.lightGrey, paddingVertical: 24 }}>
        <View>
          <Text style={{ ...texts.default, lineHeight: 22 }}>{t('Entenda os valores')}</Text>
          <Text style={{ ...texts.small, lineHeight: 18, color: colors.darkGrey }}>
            {t('Somos transparentes do início ao fim da entrega')}
          </Text>
        </View>
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}
        >
          <Text style={{ ...texts.default, lineHeight: 21 }}>{t('Entregador')}</Text>
          <Text style={{ ...texts.default, lineHeight: 21 }}>R$ {fare.courierFee}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            {t('Impostos')}
          </Text>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            R$ {fare.taxes}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            {t('Tarifa financeira')}
          </Text>
          <Text style={{ ...texts.default, lineHeight: 21, color: colors.darkGrey }}>
            R$ {fare.financialFee}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <Text style={{ ...texts.default, lineHeight: 21 }}>{t('AppJusto')}</Text>
          <Text style={{ ...texts.default, lineHeight: 21 }}>R$ {fare.platformFee} </Text>
        </View>
        <Text style={{ ...texts.small, lineHeight: 19, color: colors.darkGrey }}>
          O AppJusto cobra menos para ser mais justo com todos. Você pode aumentar a sua
          contribuição se desejar.
        </Text>
      </View>

      <ShowIf test={!!card}>
        {() => (
          <TouchableOpacity onPress={() => navigateToFillPaymentInfo()}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{t('Forma de pagamento')}</Text>
                <Image style={{ width: 32, height: 32 }} source={icons.edit} />
              </View>
              <Text>{t(`Cartão de crédito: **** ${card!.lastFourDigits}`)}</Text>
            </View>
          </TouchableOpacity>
        )}
      </ShowIf>

      <ShowIf test={!card}>
        {() => (
          <DefaultButton
            style={{ width: '100%' }}
            title={t('Incluir forma de pagamento')}
            onPress={navigateToFillPaymentInfo}
          />
        )}
      </ShowIf>

      <DefaultButton
        title={t('Fazer pedido')}
        onPress={nextStepHandler}
        disabled={!card || waiting}
        activityIndicator={waiting}
      />
    </ScrollView>
  );
}
