import { isEmpty } from 'lodash';
import React from 'react';
import { View, Text, Image } from 'react-native';

import { colors, texts, screens } from '../../styles';
import ShowIf from './ShowIf';

type Props = {
  header: string;
  icon: any;
  description?: string;
  children?: React.ReactNode | React.ReactNode[];
  background?: string;
};

export default ({ header, description, icon, children, background }: Props) => {
  return (
    <View style={[screens.padded, { backgroundColor: background ?? colors.white }]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ ...texts.big, textAlign: 'center' }}>{header}</Text>
          <View style={{ height: 114, width: 114, marginTop: 22, marginBottom: 16 }}>
            <Image source={icon} />
          </View>
          <ShowIf test={!isEmpty(description)}>
            {() => <Text style={{ ...texts.default, color: colors.darkGrey }}>{description}</Text>}
          </ShowIf>
        </View>
      </View>
      {children}
    </View>
  );
};
