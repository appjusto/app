import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import * as icons from '../assets/icons';
import DefaultButton from '../common/components/buttons/DefaultButton';
import DefaultInput from '../common/components/inputs/DefaultInput';
import { getUser } from '../common/store/user/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';
import * as fake from './fakeData';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  // const api = useContext(ApiContext);
  // const dispatch = useDispatch<AppDispatch>();
  // const tallerDevice = useTallerDevice();
  // app state
  // const user = useSelector(getUser)!;

  // screen state
  const [observation, setObservation] = useState<string>('');
  //UI
  const QuantityCounter = () => {
    const [counter, setCounter] = useState<number>(1);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: halfPadding,
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <TouchableOpacity onPress={() => setCounter(counter - 1)}>
            <View
              style={{
                height: 48,
                width: 48,
                alignItems: 'center',
                justifyContent: 'center',
                ...borders.default,
              }}
            >
              <Image source={icons.minus} />
            </View>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: padding }}>{counter}</Text>
          <TouchableOpacity onPress={() => setCounter(counter + 1)}>
            <View
              style={{
                height: 48,
                width: 48,
                alignItems: 'center',
                justifyContent: 'center',
                ...borders.default,
              }}
            >
              <Image source={icons.plus} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: padding }}>
          <DefaultButton title={`${t('Adicionar')} ${counter}`} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ paddingHorizontal: 12 }}>
        <Image source={fake.detail} style={{ width: '100%', height: 240, borderRadius: 8 }} />
        <View style={{ marginTop: padding }}>
          <Text style={{ ...texts.mediumToBig }}>{t('Nome do item')}</Text>
          <Text style={{ ...texts.default, color: colors.darkGrey, marginVertical: 4 }}>
            {t('Descrição completa do item que será exibida em até na página interna do item.')}
          </Text>
          <Text style={{ ...texts.default }}>{t('R$ 00,00')}</Text>
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
      <View style={{ paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
          <Image source={icons.info} />
          <Text style={{ ...texts.default, marginLeft: 4 }}>{t('Informações adicionais')}</Text>
        </View>
        <DefaultInput
          placeholder={t(
            'Tem alguma observação? Por exemplo: sem molho, sem cebola, ponto da carne, etc'
          )}
          multiline
          numberOfLines={6} // How much is enough?
          value={observation}
          onChangeText={setObservation}
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
      <View style={{ paddingHorizontal: 12 }}>
        <QuantityCounter />
      </View>
    </ScrollView>
  );
}
