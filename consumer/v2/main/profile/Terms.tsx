import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { colors, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

export default function Terms() {
  return (
    <ScrollView>
      <View style={{ ...screens.lightGrey, paddingBottom: 32 }}>
        <Text style={{ ...texts.x2l, marginBottom: 8, marginTop: 16 }}>
          {t('Termos de uso e política de privacidade')}
        </Text>
        <Text style={{ ...texts.sm, marginTop: 16, color: colors.grey700 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu pulvinar justo. Ut in purus
          ipsum. Nulla molestie massa nec nunc pretium vehicula quis non magna. Nullam ac finibus
          leo. Nam ullamcorper nibh hendrerit dignissim fermentum. Integer nec lorem sollicitudin,
          ultrices neque non, tincidunt turpis. In porta elit eu erat faucibus, ac convallis risus
          lacinia. Mauris tempus, ligula in dignissim sollicitudin, dolor mi congue tellus, eu
          mollis diam nibh sit amet magna. Quisque pellentesque vehicula lacus, sed iaculis libero
          efficitur eget. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. In eu pulvinar justo. Ut in purus ipsum. Nulla molestie massa nec nunc pretium
          vehicula quis non magna. Nullam ac finibus leo. Nam ullamcorper nibh hendrerit dignissim
        </Text>
        <Text style={{ ...texts.sm, marginTop: 16, color: colors.grey700 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu pulvinar justo. Ut in purus
          ipsum. Nulla molestie massa nec nunc pretium vehicula quis non magna. Nullam ac finibus
          leo. Nam ullamcorper nibh hendrerit dignissim fermentum. Integer nec lorem sollicitudin,
          ultrices neque non, tincidunt turpis. In porta elit eu erat faucibus, ac convallis risus
          lacinia. Mauris tempus, ligula in dignissim sollicitudin, dolor mi congue tellus, eu
          mollis diam nibh sit amet magna. Quisque pellentesque vehicula lacus, sed iaculis libero
          efficitur eget. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. In eu pulvinar justo. Ut in purus ipsum. Nulla molestie massa nec nunc pretium
          vehicula quis non magna. Nullam ac finibus leo. Nam ullamcorper nibh hendrerit dignissim
        </Text>
        <Text style={{ ...texts.sm, marginTop: 16, color: colors.grey700 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu pulvinar justo. Ut in purus
          ipsum. Nulla molestie massa nec nunc pretium vehicula quis non magna. Nullam ac finibus
          leo. Nam ullamcorper nibh hendrerit dignissim fermentum. Integer nec lorem sollicitudin,
          ultrices neque non, tincidunt turpis. In porta elit eu erat faucibus, ac convallis risus
          lacinia. Mauris tempus, ligula in dignissim sollicitudin, dolor mi congue tellus, eu
          mollis diam nibh sit amet magna. Quisque pellentesque vehicula lacus, sed iaculis libero
          efficitur eget. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. In eu pulvinar justo. Ut in purus ipsum. Nulla molestie massa nec nunc pretium
          vehicula quis non magna. Nullam ac finibus leo. Nam ullamcorper nibh hendrerit dignissim
        </Text>
      </View>
    </ScrollView>
  );
}
