'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import useSWR from 'swr';

export const SearchBox = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const router = useRouter();

  const [formCategory, setFormCategory] = useState(category);
  const [formQuery, setFormQuery] = useState(q);

  const {
    data: categories,
    error,
    isLoading,
  } = useSWR('/api/products/categories');

  if (error) return error.message;
  if (isLoading) return <div className='skeleton h-12 w-full'></div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?category=${formCategory}&q=${formQuery}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="join w-full">
        <input
          className="input join-item input-bordered w-full"
          placeholder="Search"
          aria-label="Search"
          defaultValue={q}
          name="q"
          onChange={(e) => setFormQuery(e.target.value)}
        />
        <button 
          className="btn join-item input-bordered whitespace-nowrap" 
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
};