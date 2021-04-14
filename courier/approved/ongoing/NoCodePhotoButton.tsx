import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { borders, colors, halfPadding, texts } from '../../../common/styles';

// interface Props extends ButtonProps {
//   children?: React.ReactNode;
//   title: string;
//   photoType: 'package' | 'front';
// }

type Props = {
  children?: React.ReactNode;
  title: string;
  photoType: 'package' | 'front';
  onPress: () => Promise<void>;
};

export const NoCodePhotoButton = ({ children, onPress, title, photoType }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...borders.default,
          height: 160,
          width: 160,
          backgroundColor: colors.grey50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Feather name={photoType === 'package' ? 'box' : 'home'} size={40} />
        <Text style={{ ...texts.xs, marginTop: halfPadding }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
