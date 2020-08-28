import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useCallback, useEffect } from 'react';
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
  //state
  const [photo, setPhoto] = useState(selfie);
  const [galleryImage, setGalleryImage] = useState(license);
  //handlers
  const pickFromGallery = useCallback(async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      const data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      const galleryImage = data;
      setGalleryImage(galleryImage);
      console.log(data);
    } else {
      alert('Precisamos do acesso à sua galeria');
    }
  }, [galleryImage]);
  const pickFromCamera = useCallback(async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      const data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      const photo = data;
      setPhoto(photo);
      console.log(data);
    } else {
      alert('Precisamos do acesso à câmera');
    }
  }, [photo]);

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
        <DocumentButton title={t('Foto de rosto')} onPress={pickFromCamera}>
          <View style={{ width: 32, height: 48 }}>
            <Image source={photo} width={32} height={48} resizeMode="cover" />
          </View>
        </DocumentButton>
        <DocumentButton title={t('RG ou CNH aberta')} onPress={pickFromGallery}>
          <View style={{ width: 32, height: 48 }}>
            <Image source={galleryImage} width={32} height={48} resizeMode="cover" />
          </View>
        </DocumentButton>
      </View>
    </View>
  );
}
