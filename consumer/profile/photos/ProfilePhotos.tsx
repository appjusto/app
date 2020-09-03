import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import * as ImageManipulator from 'expo-image-manipulator';
import { ImageResult } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import { AppDispatch, ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { ProfileParamList } from '../../../common/screens/profile/types';
import { uploadProfileImages } from '../../../common/store/courier/actions';
import { getCourier } from '../../../common/store/courier/selectors';
import { colors, texts, screens } from '../../../common/styles';
import { t } from '../../../strings';
import DocumentButton from './DocumentButton';

const defaultImageOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
};

// const defaultOutputOptions = {
//   compress: 1,
//   format: ImageManipulator.SaveFormat.JPEG,
// };

// const resizeImage = (result: ImagePicker.ImagePickerResult) => {
//   if (result.cancelled) return null;
//   const { uri } = result;
//   return ImageManipulator.manipulateAsync(
//     uri,
//     [{ resize: { width: 100, height: 100 } }],
//     defaultOutputOptions
//   );
// };

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfilePhotos'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfilePhotos'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const courier = useSelector(getCourier);

  // screen state
  const [selfie, setSelfie] = useState<ImageResult | null>(null);
  const [documentImage, setDocumentImage] = useState<ImageResult | null>(null);

  // handlers
  const pickFromGallery = useCallback(async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      const result = await ImagePicker.launchImageLibraryAsync(defaultImageOptions);
      if (result.cancelled) return;
      // const image = await resizeImage(result);
      // setDocumentImage(image);
      setDocumentImage(result);
    } else {
      alert(t('Precisamos do acesso à sua galeria'));
    }
  }, [documentImage]);
  const pickFromCamera = useCallback(async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      const result = await ImagePicker.launchCameraAsync(defaultImageOptions);
      if (result.cancelled) return;
      // const image = await resizeImage(result);
      // setSelfie(image);
      setSelfie(result);
      // console.log(data);
    } else {
      alert(t('Precisamos do acesso à câmera'));
    }
  }, [selfie]);
  // uploading files
  const uploadHandler = useCallback(() => {
    if (!selfie || !documentImage) return;
    dispatch(
      uploadProfileImages(api)(courier!.id!, selfie.uri, documentImage.uri, (progress: number) => {
        console.log(progress);
      })
    );
  }, [selfie, documentImage]);

  // UI
  return (
    <View style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.big, marginTop: 16 }}>{t('Fotos e documentos')}</Text>
      <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
        {t(
          'Agora precisamos da sua foto sua e de um documento. Se você for fazer entregas utilizando Moto e/ou Carro, envia a foto da sua CNH; caso contrário, é só enviar a foto do seu RG'
        )}
      </Text>
      <View style={{ marginTop: 24, flex: 1, alignItems: 'center' }}>
        <DocumentButton title={t('Foto de rosto')} onPress={pickFromCamera}>
          <Image
            source={selfie ?? icons.selfie}
            resizeMode="contain"
            style={selfie ? styles.image : styles.icon}
          />
        </DocumentButton>
        <DocumentButton title={t('RG ou CNH aberta')} onPress={pickFromGallery}>
          <Image
            source={documentImage ?? icons.license}
            resizeMode="contain"
            style={documentImage ? styles.image : styles.icon}
          />
        </DocumentButton>
      </View>
      <DefaultButton
        title={t('Avançar')}
        style={{ marginTop: 30, marginBottom: 16 }}
        disabled={!selfie || !documentImage}
        onPress={uploadHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 48,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
