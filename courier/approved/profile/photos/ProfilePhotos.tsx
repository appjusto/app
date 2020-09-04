import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useCallback, useContext, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ImageURISource } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../../assets/icons';
import { AppDispatch, ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/views/PaddedView';
import {
  getSelfieURL,
  getDocumentImageURL,
  uploadSelfie,
  uploadDocumentImage,
} from '../../../../common/store/courier/actions';
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
  const [previousSelfie, setPreviousSelfie] = useState<ImageURISource | undefined | null>();
  const [previousDocumentimage, setPreviousDocumentImage] = useState<
    ImageURISource | undefined | null
  >();
  const [newSelfie, setNewSelfie] = useState<ImageURISource | undefined | null>();
  const [newDocumentImage, setNewDocumentImage] = useState<ImageURISource | undefined | null>();
  const canUpload = useMemo(() => {
    // no reason to upload if nothing has changed
    if (!newSelfie && !newDocumentImage) return false;
    return (newSelfie || previousSelfie) && (newDocumentImage || previousDocumentimage);
  }, [newSelfie, newDocumentImage]);

  // effects
  // check for previously stored images
  useEffect(() => {
    // undefined indicates that we don't know yet if user has uploaded selfie
    if (previousSelfie === undefined) {
      (async () => {
        console.log('checking for selfie');
        const selfieUri = await dispatch(getSelfieURL(api)(courier!.id!));
        // null means that we've checked and there's none
        if (!selfieUri) setPreviousSelfie(null);
        else setPreviousSelfie({ uri: selfieUri });
      })();
    }
  }, [previousSelfie]);
  useEffect(() => {
    // undefined indicates that we don't know yet if user has uploaded selfie
    if (previousDocumentimage === undefined) {
      (async () => {
        console.log('checking for document image');
        const documentImageUri = await dispatch(getDocumentImageURL(api)(courier!.id!));
        // null means that we've checked and there's none
        if (!documentImageUri) setPreviousDocumentImage(null);
        else setPreviousDocumentImage({ uri: documentImageUri });
      })();
    }
  }, [previousDocumentimage]);

  // handlers
  const pickFromCamera = useCallback(async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      const result = await ImagePicker.launchCameraAsync(defaultImageOptions);
      if (result.cancelled) return;
      setNewSelfie(result);
    } else {
      alert(t('Precisamos do acesso à câmera'));
    }
  }, []);
  const pickFromGallery = useCallback(async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      const result = await ImagePicker.launchImageLibraryAsync(defaultImageOptions);
      if (result.cancelled) return;
      setNewDocumentImage(result);
    } else {
      alert(t('Precisamos do acesso à sua galeria'));
    }
  }, []);
  // uploading files
  const uploadHandler = useCallback(() => {
    if (newSelfie) {
      dispatch(uploadSelfie(api)(courier!.id!, newSelfie.uri!));
    }
    if (newDocumentImage) {
      dispatch(uploadDocumentImage(api)(courier!.id!, newDocumentImage.uri!));
    }
    navigation.goBack();
  }, [newSelfie, newDocumentImage]);

  // UI
  return (
    <PaddedView style={{ ...screens.lightGrey }}>
      <Text style={{ ...texts.default, color: colors.darkGrey }}>
        {t(
          'Agora precisamos da sua foto sua e de um documento. Se você for fazer entregas utilizando Moto e/ou Carro, envia a foto da sua CNH; caso contrário, é só enviar a foto do seu RG'
        )}
      </Text>
      <View style={{ flex: 1 }} />
      <View>
        <View style={{ alignSelf: 'center' }}>
          <DocumentButton title={t('Foto de rosto')} onPress={pickFromCamera}>
            <Image
              source={newSelfie ?? previousSelfie ?? icons.selfie}
              resizeMode="contain"
              style={(newSelfie ?? previousSelfie) !== undefined ? styles.image : styles.icon}
            />
          </DocumentButton>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ alignSelf: 'center' }}>
          <DocumentButton title={t('RG ou CNH aberta')} onPress={pickFromGallery}>
            <Image
              source={newDocumentImage ?? previousDocumentimage ?? icons.license}
              resizeMode="contain"
              style={
                (newDocumentImage ?? previousDocumentimage) !== undefined
                  ? styles.image
                  : styles.icon
              }
            />
          </DocumentButton>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton title={t('Avançar')} disabled={!canUpload} onPress={uploadHandler} />
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
