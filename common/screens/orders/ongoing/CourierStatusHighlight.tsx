import { DispatchingState } from 'appjusto-types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import { t } from '../../../../strings';
import useTallerDevice from '../../../hooks/useTallerDevice';
import { getFlavor } from '../../../store/config/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../styles';

type Props = {
  dispatchingState: DispatchingState;
};

export default function ({ dispatchingState }: Props) {
  // context
  const tallerDevice = useTallerDevice();
  // redux store
  const flavor = useSelector(getFlavor);

  if (dispatchingState !== 'arrived-pickup' && dispatchingState !== 'arrived-destination')
    return null;
  let title = '';
  let message = '';
  if (flavor === 'consumer') {
    title = t('Entregador chegou ao local');
    message =
      dispatchingState === 'arrived-pickup'
        ? t('Aguardando para retirada')
        : t('Aguardando para entrega');
  } else if (flavor === 'courier') {
    if (dispatchingState === 'arrived-pickup') {
      title = t('Aguardando para retirada');
      message = t('Confirme sua saída somente após receber o pedido');
    } else if (dispatchingState === 'arrived-destination') {
      title = t('Aguardando para entrega');
      message = t('Confirme sua saída somente após realizar a entregar');
    }
  }

  return (
    <View style={{ paddingHorizontal: padding }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View
          style={[
            styles.card,
            {
              padding: tallerDevice ? padding : halfPadding,
              marginBottom: tallerDevice ? padding : halfPadding,
              position: 'absolute',
              bottom: halfPadding,
              width: '100%',
              // marginHorizontal: tallerDevice ? padding : halfPadding,
            },
          ]}
        >
          <View style={{ height: 64, width: 64, borderRadius: 32, backgroundColor: colors.white }}>
            <Image source={icons.motocycleWhite} />
          </View>
          <View style={{ marginLeft: padding, flex: 1 }}>
            <Text style={{ ...texts.sm }}>{title}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...texts.xs,
                  color: colors.grey700,
                  flexWrap: 'wrap',
                }}
                numberOfLines={2}
              >
                {message}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...borders.default,
    borderColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.yellow,
  },
});
