import { BusinessAlgolia } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, Image, SectionList, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../../assets/icons';
import DoubleHeader from '../../../../../common/components/texts/DoubleHeader';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
import useCuisines from '../../../../../common/store/api/platform/hooks/useCuisines';
// import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import { getCurrentLocation } from '../../../../../common/store/consumer/selectors';
import { colors, halfPadding, padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { RestaurantListItem } from './RestaurantListItem';

type Props = {
  items?: BusinessAlgolia[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  onSelect: (id: string) => void;
  onEndReached?: () => void;
};

type Section = {
  title: string;
  subtitle: string;
  data: BusinessAlgolia[];
};

export default function ({ items, ListHeaderComponent, onSelect, onEndReached }: Props) {
  // redux
  const location = useSelector(getCurrentLocation);
  // state
  const cuisines = useCuisines();
  const findCuisineById = (id?: string) => cuisines?.find((c) => c.id === id);
  const open = (items ?? []).filter((restaurant) => restaurant.status === 'open');
  const closed = (items ?? []).filter((restaurant) => restaurant.status === 'closed');
  let sections: Section[] = [];
  if (open.length > 0) {
    sections = [
      {
        title: t('Restaurantes abertos agora'),
        subtitle: t('Valor justo para restaurantes e entregadores'),
        data: open,
      },
    ];
  }
  if (closed.length > 0) {
    sections = [
      ...sections,
      {
        title: t('Fechados no momento'),
        subtitle: t('Fora do horário de funcionamento'),
        data: closed,
      },
    ];
  }

  return (
    <SectionList
      style={{ ...screens.default }}
      ListEmptyComponent={
        !items ? (
          <View style={{ ...screens.centered, marginTop: padding }}>
            <ActivityIndicator size="small" color={colors.green500} />
          </View>
        ) : (
          <FeedbackView
            description={t(
              'Não encontramos nenhum resultado para a sua busca. Refaça a pesquisa ou utilize filtros diferentes.'
            )}
            icon={<Image source={icons.coneYellow} />}
          />
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      renderSectionHeader={({ section }) => (
        <View style={{ marginBottom: padding }}>
          <DoubleHeader
            title={section.title}
            subtitle={section.subtitle}
            secondary={section.data === closed}
          />
        </View>
      )}
      sections={sections}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item, section }) => (
        <View style={{ marginTop: halfPadding }}>
          <TouchableOpacity onPress={() => onSelect(item.objectID)}>
            <RestaurantListItem
              restaurant={item}
              // cuisine={findCuisineById(item.cuisine)?.name}
              cuisine={item.cuisine}
              secondary={section.data === closed}
              distance={
                location && item.businessAddress?.latlng
                  ? distanceBetweenLatLng(location, item.businessAddress.latlng)
                  : undefined
              }
            />
          </TouchableOpacity>
        </View>
      )}
      stickySectionHeadersEnabled={false}
      onEndReached={onEndReached}
    />
  );
}
