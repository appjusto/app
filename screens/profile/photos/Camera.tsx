import { Camera } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function () {
  // state
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);

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
      <Camera style={{ flex: 1 }} type={type} />
    </View>
  );
}
