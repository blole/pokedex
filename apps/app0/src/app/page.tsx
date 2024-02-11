import { Chain, order_by } from "../zeus";
import { PokemonCard } from "./PokemonCard";

export default async function Home() {
  const chain = Chain("https://beta.pokeapi.co/graphql/v1beta");

  const gen1 = await chain("query")({
    pokemon_v2_pokemonspecies: [
      {
        limit: 10,
        order_by: [{ id: order_by.asc }],
        where: {},
      },
      {
        id: true,
        name: true,
      },
    ],
  });

  return (
    <main>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {gen1.pokemon_v2_pokemonspecies.map(({ id, name }) => (
          <PokemonCard key={id} id={id} name={name} />
        ))}
      </div>
    </main>
  );
}
