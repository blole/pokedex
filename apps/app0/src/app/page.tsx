"use client";
import { PokemonCard } from "./PokemonCard";
import { useSearchPokemon } from "./useSearchPokemon";

export default function Home() {
  const { pokemon, error, isLoading } = useSearchPokemon("pika");

  return (
    <main>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {pokemon?.map(({ id, name }) => (
          <PokemonCard key={id} id={id} name={name} />
        ))}
      </div>
    </main>
  );
}
