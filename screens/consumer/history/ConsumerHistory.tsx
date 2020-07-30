import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import GoButton from '../../common/GoButton';
import { colors, texts, screens } from '../../common/styles';
import { calendar } from '../../../assets/icons';
import { t } from '../../../strings';

const ConsumerHistory = () => {
  return (
    <View style={{ ...screens.lightGrey, marginTop: 16, paddingHorizontal: 0 }}>
      <View style={styles.border}>
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image source={calendar} />
          <Text style={{ ...texts.medium, marginLeft: 8 }}>{t('Agosto, 2020')}</Text>
        </View>
      </View>
      <View style={[styles.border, { marginTop: 16 }]}>
        <TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}
          >
            <View>
              <Text style={{ ...texts.default }}>{t('Rua Augusta, 901')}</Text>
              <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Pedido No 1')}</Text>
              <Text style={{ ...texts.default, color: colors.darkGrey }}>
                {t('10/07/2020 - 12h30')}
              </Text>
            </View>
            <View>
              <GoButton />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.status}>
          <Text style={{ ...texts.small, lineHeight: 14 }}>{t('Em andamento')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderStyle: 'solid',
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  status: {
    marginTop: 8,
    marginHorizontal: 16,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.yellow,
    alignSelf: 'center',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConsumerHistory;
