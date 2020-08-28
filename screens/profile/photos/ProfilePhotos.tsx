import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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

export default function ({ navigation, image }: Props) {
  // const imageOptions = {
  //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //   allowsEditing: true,
  //   aspect: [1, 1],
  //   quality: 1,
  // };

  // const getImageFromLibrary = () => ImagePicker.launchImageLibraryAsync(imageOptions);
  // const getImageFromCamera = () => ImagePicker.launchCameraAsync(imageOptions);
  // const getImageFromSource = (source) =>
  //   source === 'library' ? getImageFromLibrary() : getImageFromCamera();
  // const source = 'library';

  // state
  // initial, denied, ready, edit

  // const initialState = !image ? 'ready' : 'edit';
  // const [state, setState] = useState(null);
  // // const [placeholderImage, setPlaceholderImage] = useState(image || placeholder);

  // handlers
  // const getPermissionAsync = useCallback(async () => {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
  //   if (status === 'denied') setState('denied');
  //   else if (status === 'undefined') {
  //     // TODO: improve as we are asking multiple permissions
  //   } else if (status === 'granted') {
  //     setState(initialState);
  //   }
  // }, [initialState]);

  // const pickImage = useCallback(async () => {
  //   if (['denied', 'undefined'].indexOf(state) !== -1) getPermissionAsync();
  //   else {
  //     try {
  //       const result = await getImageFromSource(source);
  //       if (!result.cancelled) {
  //         setState('edit');
  //         // setPlaceholderImage({ uri: result.uri });
  //         // onChange(result);
  //       }
  //     } catch (e) {
  //       console.log('TODO: handle');
  //     }
  //   }
  // }, [state, getPermissionAsync]);

  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      // console.log(data);
    } else {
      alert('Precisamos do acesso à sua galeria');
    }
  };
  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      // console.log(data);
    } else {
      alert('Precisamos do acesso à câmera');
    }
  };

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
          <Image source={selfie || image} width={32} height={48} />
        </DocumentButton>
        <DocumentButton title={t('RG ou CNH aberta')} onPress={pickFromGallery}>
          <Image source={license || image} width={40} height={54} />
        </DocumentButton>
      </View>
    </View>
  );
}
