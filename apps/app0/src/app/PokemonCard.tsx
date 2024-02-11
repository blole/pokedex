import Image from "next/image";

export type PokemonCardProps = {
  id: number;
  name: string;
};

export const PokemonCard = ({ id, name }: PokemonCardProps) => {
  return (
    <div className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-800">
        <Image
          className="h-full w-full object-cover object-center group-hover:opacity-60"
          src={`/sprites/${id}.png`}
          alt={`${name} art`}
          width={180}
          height={37}
          priority
        />
      </div>
      <h3 className="text-lg text-center">{name}</h3>
    </div>
  );
};
