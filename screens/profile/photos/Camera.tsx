import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { database } from 'firebase';

export default function () {
  const camRef = useRef(null);
  // state
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  // handlers
  function switchCameraHandler() {
    setType(
      type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  }

  // requests permission as soon as the user accesses the screen
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      // console.log(status);
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Acesso Negado</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      // console.log(data);
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        alert('Foto salva com sucesso');
        setOpen(false);
      })
      .catch((error) => console.log('err', error));
  }

  //UI
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={camRef}>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ position: 'absolute', bottom: 16, left: 16 }}
            onPress={switchCameraHandler}
          >
            <Text style={{ fontSize: 16, color: 'white' }}>Flip camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'red',
          margin: 16,
          borderRadius: 8,
          height: 32,
        }}
        onPress={takePicture}
      >
        <Text style={{ fontSize: 16, color: 'blue' }}>Tirar foto</Text>
      </TouchableOpacity>
      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 16,
              }}
            >
              <TouchableOpacity
                style={{ margin: 8, borderColor: 'black', borderStyle: 'solid', borderWidth: 1 }}
                onPress={() => setOpen(false)}
              >
                <Text style={{ fontSize: 16, color: 'black' }}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ margin: 8, borderColor: 'black', borderStyle: 'solid', borderWidth: 1 }}
                onPress={savePicture}
              >
                <Text style={{ fontSize: 16, color: 'black' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
            <Image
              style={{ width: '100%', height: 600, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}
