'use client';
import { convertParsedSearchToGraphQl } from '@/search/convertParsedSearchToGraphQl';
import { parseSearchString } from '@/search/searchStringParser';
import { Chain, GraphQLTypes, InputType, Selector, order_by } from '@/zeus';
import useSWR from 'swr';

const chain = Chain('https://beta.pokeapi.co/graphql/v1beta');

const pokemonSpeciesQuery = Selector('pokemon_v2_pokemonspecies')({
  id: true,
  name: true,
});

export type PokemonResponse = InputType<GraphQLTypes['pokemon_v2_pokemonspecies'], typeof pokemonSpeciesQuery>;

const searchPokemon = async (search: string): Promise<PokemonResponse[]> => {
  const parsedSearch = parseSearchString(search);

  if (parsedSearch.kind != 'ok') {
    throw Error(parsedSearch.error.code);
  }

  const where = convertParsedSearchToGraphQl(parsedSearch.value);

  const response = await chain('query')({
    pokemon_v2_pokemonspecies: [
      {
        limit: 10,
        order_by: [{ id: order_by.asc }],
        where,
      },
      pokemonSpeciesQuery,
    ],
  });

  return response.pokemon_v2_pokemonspecies;
};

export type UseSearchPokemonResult = {
  pokemon?: PokemonResponse[];
  error?: unknown;
  isLoading: boolean;
};

export const useSearchPokemon = (search: string): UseSearchPokemonResult => {
  const { data, error, isLoading } = useSWR<PokemonResponse[], unknown>(search, searchPokemon);

  return {
    pokemon: data,
    error,
    isLoading,
  };
};
