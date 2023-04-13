import { BusinessAlgolia } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../../../common/icons/icon-cone-yellow';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
import { getCurrentLocation } from '../../../../../common/store/consumer/selectors';
import {
  biggerPadding,
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { DoubleHeaderV3 } from '../../../../v3/common/texts/DoubleHeaderV3';
import { RestaurantListItem } from './RestaurantListItem';
import { RestaurantListSection } from './types';

interface Props extends SectionListProps<BusinessAlgolia, RestaurantListSection> {
  loading?: boolean;
  onSelect: (id: string) => void;
  onRecommend?: () => void;
  hideEmptyFeedback?: boolean;
}

export const RestaurantList = ({
  sections,
  loading,
  refreshing = false,
  hideEmptyFeedback,
  onSelect,
  onRecommend,
  ...props
}: Props) => {
  // redux
  const location = useSelector(getCurrentLocation);
  // UI
  const emptyComponent = (() => {
    if (refreshing || hideEmptyFeedback) return null;
    if (loading) {
      return (
        <View style={{ ...screens.centered, marginTop: padding }}>
          <ActivityIndicator size="large" color={colors.green500} />
        </View>
      );
    }
    return (
      <FeedbackView
        description={t(
          'Não encontramos nenhum resultado para a sua busca. Refaça a pesquisa ou utilize filtros diferentes.'
        )}
        icon={<IconConeYellow />}
      />
    );
  })();
  return (
    <SectionList
      keyboardShouldPersistTaps="handled"
      style={{ ...screens.default, paddingBottom: padding }}
      ListFooterComponent={
        loading ? null : (
          <View
            style={{
              height: doublePadding,
              backgroundColor: colors.grey50,
            }}
          />
        )
      }
      ListEmptyComponent={emptyComponent}
      renderSectionHeader={({ section }) => {
        return (
          <View>
            {!section.available ? (
              <PaddedView>
                <PaddedView
                  style={{ backgroundColor: colors.green100, borderRadius: 24 }}
                  padding={biggerPadding}
                >
                  <Text style={{ ...texts.sm, color: colors.green700 }}>
                    Indique um restaurante
                  </Text>
                  <Text style={{ ...texts.lg, width: '70%' }}>
                    Gostaria de um restaurante que não viu por aqui?
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: doublePadding,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ ...texts.x2s }}>INDICAR RESTAURANTE</Text>
                    <Feather style={{ marginLeft: halfPadding }} size={16} name="arrow-right" />
                  </View>
                </PaddedView>
              </PaddedView>
            ) : null}
            {section.title && section.subtitle ? (
              <View
                style={{
                  paddingHorizontal: padding,
                  marginBottom: padding,
                }}
              >
                <DoubleHeaderV3 title={section.title} subtitle={section.subtitle} />
              </View>
            ) : null}
          </View>
        );
      }}
      sections={sections}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item }) => {
        return (
          <View
            style={{
              marginBottom: halfPadding,
            }}
          >
            <TouchableOpacity onPress={() => onSelect(item.objectID)}>
              <RestaurantListItem
                id={item.objectID}
                restaurant={item}
                cuisine={item.cuisine}
                distance={
                  location && item.businessAddress?.latlng
                    ? distanceBetweenLatLng(location, item.businessAddress.latlng)
                    : undefined
                }
              />
            </TouchableOpacity>
          </View>
        );
      }}
      stickySectionHeadersEnabled={false}
      refreshing={refreshing}
      {...props}
    />
  );
};
