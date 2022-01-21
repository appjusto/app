import React from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import { useSegmentScreen } from '../../common/store/api/track';
import { colors, padding, screens, texts } from '../../common/styles';

//TODO: add ScreenNavigationProp
export const BusinessOrderDetail = () => {
  //side effects
  //tracking
  useSegmentScreen('BusinessOrderDetail');
  // UI
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.default }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        <View>
          <Text style={[texts.bold, texts.x2l]}>Pedido Nº 0001</Text>
          <Text style={{ ...texts.md, color: colors.grey700 }}>
            Nome do cliente: <Text style={{ color: colors.black }}>Daniel</Text>
          </Text>
          <Text style={{ ...texts.md, color: colors.grey700 }}>
            Nº de pedidos no restaurante: <Text style={{ color: colors.black }}>10</Text>
          </Text>
          <Text style={{ ...texts.md, color: colors.grey700 }}>
            Horário do pedido: <Text style={{ color: colors.black }}>10h23m34s</Text>
          </Text>
        </View>
        <View style={{ marginTop: padding }}>
          {/* this button will render only before accepting the order */}
          <DefaultButton title="CONFIRMAR PEDIDO" />
          {/* this button will render after accepting the order until its delivery */}
          <DefaultButton title="Abrir chat com cliente" secondary />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
