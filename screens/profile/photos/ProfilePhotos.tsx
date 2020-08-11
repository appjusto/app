import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';

import { license, selfie } from '../../../assets/icons';
import { t } from '../../../strings';
import { colors, texts, screens } from '../../common/styles';
import { ProfileParamList } from '../types';
import DocumentButton from './DocumentButton';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfilePhotos'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfilePhotos'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  //Pick an image (what to do with the image?)
  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  if (selectedImage !== null) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={{ width: 300, height: 300, resizeMode: 'contain' }}
        />
      </View>
    );
  }
  // UI
  return (
    <View style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.big, marginTop: 16 }}>{t('Fotos e documentos')}</Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Agora precisamos da sua foto para incluir nas entregas. Se você optou por Moto e/ou Carro, vamos precisar também da foto da sua CNH; caso contrário, é só enviar a foto do seu RG'
        )}
      </Text>
      <View style={{ marginTop: 24, flex: 1, alignItems: 'center' }}>
        <DocumentButton title={t('Foto de rosto')} onPress={openImagePickerAsync}>
          <Image source={selfie} width={32} height={48} />
        </DocumentButton>

        <DocumentButton title={t('RG ou CNH aberta')} onPress={openImagePickerAsync}>
          <Image source={license} width={40} height={54} />
        </DocumentButton>
      </View>
    </View>
  );
}
