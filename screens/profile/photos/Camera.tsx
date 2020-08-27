import { Camera } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function () {
  // state
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);

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
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Acesso Negado</Text>;
  }

  //UI
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type}>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ position: 'absolute', bottom: 16, left: 16 }}
            onPress={switchCameraHandler}
          >
            <Text style={{ fontSize: 16, color: 'white' }}>Flip camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
