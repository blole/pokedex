import { Field, NumberComparator, StringComparator, type Node } from './grammar';
import { ValueTypes } from '@/zeus';

const numberComparators = {
  [NumberComparator.EQ]: '_eq',
  [NumberComparator.GT]: '_gt',
  [NumberComparator.GTE]: '_gte',
  [NumberComparator.LT]: '_lt',
  [NumberComparator.LTE]: '_lte',
} as const;

const stringComparators = {
  [StringComparator.REGEX]: '_iregex',
};

export const convertParsedSearchToGraphQl = (node: Node): ValueTypes['pokemon_v2_pokemonspecies_bool_exp'] => {
  if (node[0] === 'and') {
    const [, ...rest] = node;
    return { _and: rest.map((x: Node) => convertParsedSearchToGraphQl(x)) };
  }
  if (node[0] === 'or') {
    const [, ...rest] = node;
    return { _or: rest.map((x: Node) => convertParsedSearchToGraphQl(x)) };
  }
  const [field, comparator, value] = node;
  switch (field) {
    case Field.GEN:
      return {
        generation_id: { [numberComparators[comparator]]: value },
      };
    case Field.ID:
      return {
        id: { [numberComparators[comparator]]: value },
      };
    case Field.NAME:
      return {
        name: { [stringComparators[comparator]]: value },
      };
    case Field.TYPE:
      throw Error('not yet implemented');
  }
};
