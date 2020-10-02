import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import ShowIf from '../../common/components/views/ShowIf';
import useTallerDevice from '../../common/hooks/useTallerDevice';
import { colors, doublePadding, halfPadding, padding, texts, borders } from '../../common/styles';
import { t } from '../../strings';
import * as icons from '../../assets/icons';

const { width } = Dimensions.get('window');
export default function () {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const tallerDevice = useTallerDevice();

  return (
    <PaddedView style={{ backgroundColor: colors.green }}>
      <ShowIf test={tallerDevice}>
        {() => (
          <Text
            style={[
              texts.big,
              {
                paddingBottom: tallerDevice ? doublePadding : padding,
                marginTop: tallerDevice ? doublePadding : 0,
              },
            ]}
          >
            {t('Somos um delivery aberto, transparente e consciente.')}
          </Text>
        )}
      </ShowIf>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: tallerDevice ? doublePadding : halfPadding,
        }}
      >
        <View style={[styles.controlItem, { backgroundColor: colors.white }]}>
          <TouchableOpacity onPress={() => {}}>
            <Image source={icons.consumerHomeIllustration} />
            <Text style={[texts.default, { paddingTop: 4 }]}>{t('Transporte de encomendas')}</Text>
            <Text style={[texts.small, { paddingTop: halfPadding, color: colors.darkGrey }]}>
              {t('Para buscar e deixar pacotes')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[styles.controlItem, { backgroundColor: colors.lightGreen, flexDirection: 'row' }]}
        >
          <TouchableOpacity onPress={() => {}}>
            <View>
              <Image source={icons.consumerHomePizza} />
              <Text style={[texts.default, { paddingTop: 4 }]}>
                {t('Restaurantes e alimentação')}
              </Text>
              <Text style={[texts.small, { paddingTop: halfPadding, color: colors.darkGrey }]}>
                {t('Peça comida de uma forma justa')}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.white,
                borderBottomLeftRadius: 8,
                borderTopRightRadius: 8,
                position: 'absolute',
                top: -1,
                right: -12,
                paddingHorizontal: halfPadding,
                paddingVertical: 4,
              }}
            >
              <Text style={{ ...texts.small }}>{t('Em breve')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  controlItem: {
    ...borders.default,
    borderColor: colors.white,
    width: Math.floor((width - 3 * padding) / 2),
    // height: Math.floor(height * 0.30),
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  // priceTag: {
  //   borderWidth: 1,
  //   borderStyle: 'solid',
  //   borderColor: colors.green,
  //   width: 74,
  //   height: 74,
  //   borderRadius: 37, // half of size
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});
