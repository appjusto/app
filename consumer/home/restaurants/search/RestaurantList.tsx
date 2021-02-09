import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { SectionList, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import useCuisines from '../../../../common/store/api/order/hooks/useCuisines';
// import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import DoubleHeader from '../components/DoubleHeader';
import RestaurantListItem from './RestaurantListItem';

type Props = {
  items?: WithId<Business>[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  onSelect: (id: string) => void;
  onEndReached?: () => void;
};

type Section = {
  title: string;
  subtitle: string;
  data: WithId<Business>[];
};

export default function ({ items, ListHeaderComponent, onSelect, onEndReached }: Props) {
  // redux store
  const location = useSelector(getCurrentLocation);
  // state
  const cuisines = useCuisines();
  const findCuisineById = (id?: string) => cuisines?.find((c) => c.id === id);
  if (items && items.length === 0) {
    return (
      <FeedbackView
        header={t('Sem restaurantes na sua região')}
        description={t(
          'Não encontramos nenhum resultado para a sua busca. Refaça a pesquisa ou utilize filtros diferentes.'
        )}
        icon={icons.coneYellow}
      />
    );
  }

  const open = (items ?? []).filter((restaurant) => restaurant.status === 'open');
  const closed = (items ?? []).filter((restaurant) => restaurant.status === 'closed');
  const sections: Section[] = [
    {
      title: t('Restaurantes abertos agora'),
      subtitle: t('Valor justo para restaurantes e entregadores'),
      data: open,
    },
    {
      title: t('Fechados no momento'),
      subtitle: t('Fora do horário de funcionamento'),
      data: closed,
    },
  ];

  return (
    <SectionList
      style={{ ...screens.default }}
      ListHeaderComponent={ListHeaderComponent}
      sections={sections}
      renderSectionHeader={({ section }) => (
        <DoubleHeader title={section.title} subtitle={section.subtitle} />
      )}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled={false}
      renderItem={({ item }) => (
        <View style={{ marginTop: padding }}>
          <TouchableOpacity onPress={() => onSelect(item.id)}>
            <RestaurantListItem
              restaurant={item}
              cuisine={findCuisineById(item.cuisine?.id)?.name}
              distance={
                location && item.businessAddress?.latlng
                  ? distanceBetweenLatLng(location, item.businessAddress.latlng)
                  : undefined
              }
            />
          </TouchableOpacity>
        </View>
      )}
      onEndReached={onEndReached}
    />
  );
}
