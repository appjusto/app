import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';

// import { getOngoingOrders } from '../../../store/selectors/consumer';
import { colors, texts } from '../../common/styles';
import { navigation } from '../../../assets/icons';
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
        <View style={styles.optionsContainer}></View>
      </View>
      <View style={styles.whiteContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greenContainer: {
    width: '100%',
    height: '68.5%',
    backgroundColor: colors.green,
    paddingHorizontal: 16,
  },
  whiteContainer: {
    width: '100%',
    height: '31.5%',
    paddingHorizontal: 16,
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
  optionsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 204,
  },
});
