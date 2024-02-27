'use client';
import { useEffect, useState } from 'react';
import { PokemonCard } from './PokemonCard';
import { Search } from './Search';
import { useSearchPokemon } from './useSearchPokemon';
import { encodeQueryParameter, useQueryParameters } from '@/hooks/useQueryParameters';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { search: querySearch } = useQueryParameters(['search']);
  const [search, setSearch] = useState<string>(querySearch ?? '');
  const [appliedSearch, setAppliedSearch] = useState<string>(querySearch ?? '');
  const { pokemon } = useSearchPokemon(appliedSearch);

  useEffect(() => {
    setSearch(querySearch ?? '');
    setAppliedSearch(querySearch ?? '');
  }, [querySearch]);

  useEffect(() => {
    if (appliedSearch != '') {
      router.push(`?search=${encodeQueryParameter(appliedSearch)}`);
    } else {
      router.push('?');
    }
  }, [appliedSearch, router]);

  return (
    <main className='flex min-h-full flex-1 flex-col px-6 py-3 lg:px-8 gap-y-3'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <Search
          value={search}
          setValue={setSearch}
          onSubmit={setAppliedSearch}
          className='w-full rounded-full outline-none leading-tight border-0 py-2 px-4 text-sm'
        />
      </div>
      <div className='grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4'>
        {pokemon?.length === 0
          ? 'no hits'
          : pokemon?.map(({ id, name }) => <PokemonCard key={id} id={id} name={name} />)}
      </div>
    </main>
  );
}
