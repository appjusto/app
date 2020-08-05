import React from 'react';
import { View, Text, Image } from 'react-native';

import { motocycle } from '../../assets/icons';
import { colors, texts, screens } from './styles';

type Props = {
  header: string;
  icon: any;
  description: string;
  children: React.ReactNode | React.ReactNode[];
};

export default ({ header, description, children }: Props) => {
  return (
    <View style={[screens.padded, { backgroundColor: colors.lightGrey }]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...texts.big, textAlign: 'center' }}>{header}</Text>
          <View style={{ height: 114, width: 114, marginTop: 22, marginBottom: 16 }}>
            <Image source={motocycle} />
          </View>
          <Text style={{ ...texts.default, color: colors.darkGrey }}>{description}</Text>
        </View>
      </View>
      {children}
    </View>
  );
};
