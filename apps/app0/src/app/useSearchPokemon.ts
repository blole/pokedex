"use client";
import { Chain, GraphQLTypes, InputType, Selector, order_by } from "@/zeus";
import useSWR from "swr";

const chain = Chain("https://beta.pokeapi.co/graphql/v1beta");

const pokemonSpeciesQuery = Selector("pokemon_v2_pokemonspecies")({
  id: true,
  name: true,
});

export type PokemonResponse = InputType<
  GraphQLTypes["pokemon_v2_pokemonspecies"],
  typeof pokemonSpeciesQuery
>;

const searchPokemon = async (search: string): Promise<PokemonResponse[]> => {
  const response = await chain("query")({
    pokemon_v2_pokemonspecies: [
      {
        limit: 10,
        order_by: [{ id: order_by.asc }],
        where: { name: { _iregex: search } },
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
  const { data, error, isLoading } = useSWR(search, searchPokemon);

  return {
    pokemon: data,
    error,
    isLoading,
  };
};
