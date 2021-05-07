import { Ordering, WithId } from '@appjusto/types';

const ordered = <T extends object>(items: WithId<T>[], order: string[]): WithId<T>[] => {
  return items
    .filter((i) => order.includes(i.id)) // filtering out first
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

export const getSorted = <T extends object, T2 extends object>(
  firstLevels: WithId<T>[],
  secondLevels: WithId<T2>[],
  config: Ordering | undefined
) => {
  if (firstLevels.length === 0 || !config) return [];
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = config;
  return ordered(firstLevels, firstLevelIds).map((parent) => {
    if (!secondLevelIdsByFirstLevelId) {
      return {
        ...parent,
        items: [],
      };
    }
    return {
      ...parent,
      items: ordered(secondLevels, secondLevelIdsByFirstLevelId[parent.id]),
    };
  });
};
