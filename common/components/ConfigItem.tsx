import React, { ReactNode } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';

import { checklistTick } from '../../assets/icons';
import { t } from '../../strings';
import { colors, texts, padding, borders } from '../styles';
import ArrowBox from './ArrowBox';
import ShowIf from './views/ShowIf';

type Props = {
  title: string;
  subtitle: string;
  checked?: boolean;
  children?: ReactNode;
  onPress: () => void;
};

export default function ({ title, subtitle, checked, children, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <ShowIf test={checked ?? false}>
                {() => <Image source={checklistTick} style={{ marginRight: 8 }} />}
              </ShowIf>
              <Text style={{ ...texts.default, paddingBottom: 8 }}>{title}</Text>
            </View>
            <Text
              style={{
                ...texts.default,
                color: colors.darkGrey,
                paddingBottom: padding,
              }}
            >
              {subtitle}
            </Text>
          </View>
          <View>
            <ArrowBox />
          </View>
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderBottomColor: colors.grey,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    // flexWrap: 'wrap',
  },
  sending: {
    backgroundColor: colors.white,
    ...borders.default,
    borderColor: colors.black,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    width: 116,
    marginBottom: 16,
  },
});
