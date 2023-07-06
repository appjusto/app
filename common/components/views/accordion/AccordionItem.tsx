import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View, ViewProps } from 'react-native';
import { colors, doublePadding, padding, texts } from '../../../styles';

export interface AccordionItemData {
  title: string;
  subtitle?: string;
  body?: { title?: string; text: string }[];
  children?: React.ReactNode | React.ReactNode[];
}

interface Props extends ViewProps {
  data: AccordionItemData;
  collpased?: boolean;
  onPress: () => void;
}

export const AccordionItem = ({ data, collpased, style, onPress, ...props }: Props) => {
  const { title, subtitle, body, children } = data;
  return (
    <Pressable onPress={onPress}>
      <View style={[{ padding, backgroundColor: colors.white }, style]} {...props}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ maxWidth: '90%' }}>
            <Text
              style={{
                ...texts.sm,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  ...texts.xs,
                  color: colors.grey700,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
          <Feather size={28} name={collpased ? 'chevron-up' : 'chevron-down'} />
        </View>
        <View>
          <View>
            {collpased && body
              ? body.map((item, index) => (
                  <View
                    key={item.text}
                    style={{ marginTop: index === 0 ? padding : doublePadding }}
                  >
                    {item.title ? (
                      <Text
                        style={{
                          ...texts.sm,
                          ...texts.bold,
                          color: colors.grey700,
                        }}
                      >
                        {item.title}
                      </Text>
                    ) : null}
                    {item.text ? (
                      <Text
                        style={{
                          ...texts.sm,
                          color: colors.grey700,
                        }}
                      >
                        {item.text}
                      </Text>
                    ) : null}
                  </View>
                ))
              : null}
          </View>
          {collpased && children ? children : null}
        </View>
      </View>
    </Pressable>
  );
};
