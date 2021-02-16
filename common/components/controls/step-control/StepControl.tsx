import React from 'react';
import { LayoutAnimation, LayoutRectangle, TouchableOpacity, View, ViewProps } from 'react-native';
import { IconPinPackageWhite } from '../../../icons/icon-pin';
import { colors } from '../../../styles';
import { StepControlItem } from './StepControlItem';

interface Props extends ViewProps {
  labels: string[];
  activeIndex?: number;
  onChange?: (index: number) => void;
}

type PinByIndexState = {
  [key: string]: number;
};

export const StepControl = ({ labels, activeIndex = 0, onChange, style, ...props }: Props) => {
  const pinWidth = 32;
  // state
  const [pinLeft, setPinLeft] = React.useState(0);
  const [pinLeftByIndex, setPinLeftByIndex] = React.useState<PinByIndexState>({});
  // side effects
  React.useEffect(() => {
    if (pinLeftByIndex[`${activeIndex}`]) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPinLeft(pinLeftByIndex[`${activeIndex}`]);
    }
  }, [activeIndex]);
  // UI handlers
  const onMeasure = (index: number, layout: LayoutRectangle) => {
    const left = layout.x + (layout.width - pinWidth) * 0.5;
    setPinLeftByIndex({
      ...pinLeftByIndex,
      [`${index}`]: left,
    });
    if (index === activeIndex) setPinLeft(left);
  };
  // UI
  return (
    <View style={[null, style]} {...props}>
      <IconPinPackageWhite style={{ left: pinLeft }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {labels.map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <View
                style={{
                  width: 32,
                  height: 1,
                  backgroundColor: activeIndex === i ? colors.black : colors.grey500,
                }}
              />
            )}
            <TouchableOpacity
              onPress={() => (onChange ? onChange(i) : null)}
              activeOpacity={onChange ? 0.2 : 1}
              onLayout={(ev) => onMeasure(i, ev.nativeEvent.layout)}
            >
              <StepControlItem
                active={activeIndex === i}
                // onLayout={(ev) => onMeasure(i, ev.nativeEvent.layout)}
              >
                {label}
              </StepControlItem>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};
