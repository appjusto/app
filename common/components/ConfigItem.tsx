import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';

import { checklistTick } from '../../assets/icons';
import { colors, texts, padding } from '../styles';
import ArrowBox from './ArrowBox';
import ShowIf from './views/ShowIf';

type Props = {
  title: string;
  subtitle: string;
  checked?: boolean;
  onPress: () => void;
};

export default function ({ title, subtitle, checked, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomColor: colors.grey,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    // flexWrap: 'wrap',
  },
});
