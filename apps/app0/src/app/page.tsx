"use client";
import { useState } from "react";
import { PokemonCard } from "./PokemonCard";
import { Search } from "./Search";
import { useSearchPokemon } from "./useSearchPokemon";

export default function Home() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const { pokemon, error, isLoading } = useSearchPokemon(appliedSearch);

  return (
    <main className="flex min-h-full flex-1 flex-col px-6 py-3 lg:px-8 gap-y-3">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Search
          value={search}
          setValue={setSearch}
          onSubmit={setAppliedSearch}
          className="w-full rounded-full outline-none leading-tight border-0 py-2 px-4 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {pokemon?.length === 0
          ? "no hits"
          : pokemon?.map(({ id, name }) => (
              <PokemonCard key={id} id={id} name={name} />
            ))}
      </div>
    </main>
  );
}
