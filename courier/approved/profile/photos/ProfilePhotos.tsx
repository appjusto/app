import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import * as ImageManipulator from 'expo-image-manipulator';
import { ImageResult } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../../assets/icons';
import { AppDispatch, ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/views/PaddedView';
import { uploadProfileImages } from '../../../../common/store/courier/actions';
import { getCourier } from '../../../../common/store/courier/selectors';
import { colors, texts, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ProfileParamList } from '../types';
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
  const { height } = Dimensions.get('window');
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
    <PaddedView style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.default, color: colors.darkGrey }}>
        {t(
          'Agora precisamos da sua foto sua e de um documento. Se você for fazer entregas utilizando Moto e/ou Carro, envia a foto da sua CNH; caso contrário, é só enviar a foto do seu RG'
        )}
      </Text>
      <View style={{ flex: 1 }} />
      {height < 700 ? (
        <View>
          <View style={{ alignSelf: 'center' }}>
            <DocumentButton title={t('Foto de rosto')} onPress={pickFromCamera}>
              <Image
                source={selfie ?? icons.selfie}
                resizeMode="contain"
                style={selfie ? styles.image : styles.icon}
              />
            </DocumentButton>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ alignSelf: 'center' }}>
            <DocumentButton title={t('RG ou CNH aberta')} onPress={pickFromGallery}>
              <Image
                source={documentImage ?? icons.license}
                resizeMode="contain"
                style={documentImage ? styles.image : styles.icon}
              />
            </DocumentButton>
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignSelf: 'center' }}>
            <DocumentButton title={t('Foto de rosto')} onPress={pickFromCamera}>
              <Image
                source={selfie ?? icons.selfie}
                resizeMode="contain"
                style={selfie ? styles.image : styles.icon}
              />
            </DocumentButton>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <DocumentButton title={t('RG ou CNH aberta')} onPress={pickFromGallery}>
              <Image
                source={documentImage ?? icons.license}
                resizeMode="contain"
                style={documentImage ? styles.image : styles.icon}
              />
            </DocumentButton>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }} />
      <DefaultButton
        title={t('Avançar')}
        disabled={!selfie || !documentImage}
        onPress={uploadHandler}
        style={Platform.OS === 'ios' ? { marginBottom: 16 } : ''}
      />
    </PaddedView>
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
