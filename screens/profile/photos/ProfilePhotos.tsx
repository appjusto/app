import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Image } from 'react-native';

import { license, selfie } from '../../../assets/icons';
import { t } from '../../../strings';
import { colors, texts, screens } from '../../common/styles';
import DocumentButton from './DocumentButton';
import { ProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfilePhotos'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfilePhotos'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // UI
  return (
    <View style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.big, marginTop: 16 }}>{t('Fotos e documentos')}</Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Se você for fazer entregas por Moto e/ou Carro, vamos precisar da foto da sua CNH; caso contrário, é só enviar a foto do seu RG.'
        )}
      </Text>
      <View style={{ marginTop: 24, flex: 1, alignItems: 'center' }}>
        <DocumentButton title={t('Foto de rosto')} onPress={() => null}>
          <Image source={selfie} width={32} height={48} />
        </DocumentButton>

        <DocumentButton title={t('RG ou CNH aberta')} onPress={() => null}>
          <Image source={license} width={40} height={54} />
        </DocumentButton>
      </View>
    </View>
  );
}
