import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
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
          <Text style={styles.searchText}>
            {t('Avenida Paulista, São Paulo, SP')}
          </Text>
        </View>
        <View style={styles.containerBigText}>
          <Text style={styles.bigText}>{t('weAre')}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <View style={styles.actionBox}>
            <View style={styles.illustrationContainer}>
              <Image source={illustration} style={styles.illustration} />
            </View>
            <View style={styles.mediumContainer}>
              <Text style={styles.mediumText}>
                {t('Transportar Encomendas')}
              </Text>
            </View>
            <View style={styles.smallContainer}>
              <Text style={{ ...styles.smallText, color: colors.darkGrey }}>
                {t('Para buscar e deixar pacotes')}
              </Text>
            </View>
          </View>
          <View
            style={{ ...styles.actionBox, backgroundColor: colors.lightGreen }}
          >
            <View style={styles.illustrationContainer}>
              <Image source={illustration} style={styles.illustration} />
            </View>
            <View style={styles.mediumContainer}>
              <Text style={styles.mediumText}>
                {t('Restaurantes e alimentação')}
              </Text>
            </View>
            <View style={styles.smallContainer}>
              <Text style={styles.smallText}>
                {t('Seus preferidos estarão por aqui')}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.whiteContainer}>
        <ImageBackground
          source={BG}
          style={{ height: '100%', width: '100%' }}
          style={styles.request}
        >
          <View style={{paddingHorizontal: 16}}>
            <View style={styles.history}>
              <View style={styles.reqContainer}>
                <Image source={requests} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.mediumText}>
                  {t('Histórico de pedidos')}
                </Text>
                <Text style={{ ...styles.smallText, color: colors.darkGrey }}>
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
    height: '55%',
    backgroundColor: colors.green,
    paddingHorizontal: 16,
  },
  whiteContainer: {
    width: '100%',
    height: '45%',
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
    ...texts.default,
    fontSize: 13,
    lineHeight: 16,
    marginLeft: 9,
  },
  containerBigText: {
    width: '100%',
    height: 58,
    alignItems: 'flex-start',
    marginTop: 32,
  },
  bigText: {
    fontSize: 24,
    lineHeight: 29,
    color: '#000',
    ...texts.default,
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
  mediumText: {
    ...texts.default,
    fontSize: 15,
    lineHeight: 18,
  },
  smallContainer: {
    height: 32,
    width: '80%',
    marginTop: 8,
  },
  smallText: {
    ...texts.default,
    fontSize: 13,
    lineHeight: 16,
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
