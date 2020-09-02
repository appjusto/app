import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useCallback } from 'react';
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
        quality: 1,
      });
      const galleryImage = await ImageManipulator.manipulateAsync(
        data.uri,
        [{ resize: { width: 100, height: 100 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log(galleryImage);
      setGalleryImage(galleryImage);
      // console.log(data);
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
        quality: 1,
      });
      const photo = await ImageManipulator.manipulateAsync(
        data.uri,
        [{ resize: { width: 100, height: 100 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPhoto(photo);
      // console.log(data);
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
          <Image
            source={photo}
            width={32}
            height={48}
            resizeMode="contain"
            style={{ borderRadius: 50 }}
          />
        </DocumentButton>
        <DocumentButton title={t('RG ou CNH aberta')} onPress={pickFromGallery}>
          <Image
            source={galleryImage}
            width={32}
            height={48}
            resizeMode="contain"
            style={{ borderRadius: 50 }}
          />
        </DocumentButton>
      </View>
    </View>
  );
}
