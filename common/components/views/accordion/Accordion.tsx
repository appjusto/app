import React from 'react';
import { View, ViewProps } from 'react-native';
import { halfPadding } from '../../../styles';
import { AccordionItem, AccordionItemData } from './AccordionItem';

interface Props extends ViewProps {
  items: AccordionItemData[];
  selectedItemTitle?: string;
  onSelectItem: (itemId: string) => void;
}

export const Accordion = ({ items, selectedItemTitle, style, onSelectItem, ...props }: Props) => {
  return (
    <View style={[style]} {...props}>
      {items.map((item, index) => (
        <View key={item.title} style={{ marginTop: index === 0 ? 0 : halfPadding }}>
          <AccordionItem
            data={item}
            collpased={selectedItemTitle === item.title}
            onPress={() => onSelectItem(item.title)}
          />
        </View>
      ))}
    </View>
  );
};
