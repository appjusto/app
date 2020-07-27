import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image, ImageBackground } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';

// import { getOngoingOrders } from '../../../store/selectors/consumer';
import { colors, texts } from '../../common/styles';
import { navigation, illustration, BG, requests } from '../../../assets/icons';
import { t } from '../../../strings';

export default function ConsumerHome() {
  // context
  // const dispatch = useDispatch();

  // state
  // const ongoingOrders = useSelector(getOngoingOrders);

  return (
    <View style={styles.container}>
      {/* <Text># of ongoing orders: {ongoingOrders.length}</Text> */}
      <View style={styles.greenContainer}>
        <View style={styles.searchBox}>
          <Image source={navigation} />
          <Text style={styles.searchText}>{t('Avenida Paulista, São Paulo, SP')}</Text>
        </View>
        <View style={styles.containerBigText}>
          <Text style={{ ...texts.big }}>
            {t('Somos um delivery aberto, transparente e consciente')}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <View style={styles.actionBox}>
            <View style={styles.illustrationContainer}>
              <Image source={illustration} style={styles.illustration} />
            </View>
            <View style={styles.mediumContainer}>
              <Text style={{ ...texts.default }}>{t('Transportar Encomendas')}</Text>
            </View>
            <View style={styles.smallContainer}>
              <Text style={{ ...texts.small, color: colors.darkGrey }}>
                {t('Para buscar e deixar pacotes')}
              </Text>
            </View>
          </View>
          <View style={{ ...styles.actionBox, backgroundColor: colors.lightGreen }}>
            <View style={styles.illustrationContainer}>
              <Image source={illustration} style={styles.illustration} />
            </View>
            <View style={styles.mediumContainer}>
              <Text style={{ ...texts.default }}>{t('Restaurantes e alimentação')}</Text>
            </View>
            <View style={styles.smallContainer}>
              <Text style={{ ...texts.small }}>{t('Seus preferidos estarão por aqui')}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.whiteContainer}>
        <ImageBackground source={BG} style={{ height: '100%', width: '100%', flex: 1 }}>
          <View style={{ paddingHorizontal: 16 }}>
            <View style={styles.history}>
              <View style={styles.reqContainer}>
                <Image source={requests} />
              </View>
              <View style={styles.textContainer}>
                <Text style={{ ...texts.default }}>{t('Histórico de pedidos')}</Text>
                <Text style={{ ...texts.small, color: colors.darkGrey }}>
                  {t('Você ainda não fez pedidos')}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 16
  },
  greenContainer: {
    width: '100%',
    height: '60%',
    backgroundColor: colors.green,
    paddingHorizontal: 16,
  },
  whiteContainer: {
    width: '100%',
    height: '40%',
    // paddingHorizontal: 16,
  },
  searchBox: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.lightGreen,
    height: 40,
    width: '66.6%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: 32,
    marginTop: 16,
    alignItems: 'center',
  },
  searchText: {
    ...texts.small,
    marginLeft: 9,
  },
  containerBigText: {
    width: '100%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 32,
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 224,
    marginTop: 24,
    justifyContent: 'space-between',
  },
  actionBox: {
    width: '47.5%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: 'white',
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  illustrationContainer: {
    width: '100%',
    height: '52%',
  },
  illustration: {
    // marginHorizontal: 12,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
  },
  mediumContainer: {
    height: 36,
    marginTop: 8,
  },
  smallContainer: {
    height: 32,
    width: '80%',
    marginTop: 8,
  },
  history: {
    // marginHorizontal: 16,
    height: 96,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    marginTop: 24,
  },
  reqContainer: {
    paddingHorizontal: 16,
    height: 80,
    width: '20%',
  },
  request: {
    flex: 1,
    resizeMode: 'cover',
    // justifyContent: "center"
  },
  textContainer: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
});
