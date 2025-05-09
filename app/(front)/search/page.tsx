import Link from 'next/link';
import ProductItem from '@/components/products/ProductItem';
import { Rating } from '@/components/products/Rating';
import productServices from '@/lib/services/productService';

// Constants remain unchanged
const SORT_ORDERS = ['newest', 'lowest', 'highest', 'rating'];
const PRICE_RANGES = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
];
const RATINGS = [5, 4, 3, 2, 1];

// Metadata remains unchanged
export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  const hasFilters =
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all';

  return {
    title: hasFilters
      ? `Search ${q !== 'all' ? q : ''}
         ${category !== 'all' ? ` : Category ${category}` : ''}
         ${price !== 'all' ? ` : Price ${price}` : ''}
         ${rating !== 'all' ? ` : Rating ${rating}` : ''}`
      : 'Search Products',
  };
}

export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  // All JavaScript logic remains unchanged
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const [categories, { countProducts, products, pages }] = await Promise.all([
    productServices.getCategories(),
    productServices.getByQuery({ category, q, price, rating, page, sort }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Modern Filters Sidebar */}
        <div className="rounded-xl bg-base-300 p-6 shadow-md lg:sticky lg:top-4 lg:h-fit">
          <h2 className="mb-6 text-xl font-bold text-primary">Filters</h2>

          <div className="space-y-6">
            <FilterSection title="Categories">
              <FilterLink
                active={category === 'all'}
                href={getFilterUrl({ c: 'all' })}
                label="All Categories"
              />
              {categories.map((c: string) => (
                <FilterLink
                  key={c}
                  active={c === category}
                  href={getFilterUrl({ c })}
                  label={c}
                />
              ))}
            </FilterSection>

            <FilterSection title="Price Range">
              <FilterLink
                active={price === 'all'}
                href={getFilterUrl({ p: 'all' })}
                label="Any Price"
              />
              {PRICE_RANGES.map((p) => (
                <FilterLink
                  key={p.value}
                  active={p.value === price}
                  href={getFilterUrl({ p: p.value })}
                  label={p.name}
                />
              ))}
            </FilterSection>

            <FilterSection title="Customer Rating">
              <FilterLink
                active={rating === 'all'}
                href={getFilterUrl({ r: 'all' })}
                label="All Ratings"
              />
              {RATINGS.map((r) => (
                <div key={r} className="py-1">
                  <Link
                    className={`flex items-center rounded-box p-2 ${`${r}` === rating
                      ? 'bg-base-100 text-green-500'
                      : 'hover:bg-base-200'
                      }`}
                    href={getFilterUrl({ r: `${r}` })}
                  >
                    <Rating caption=" & up" value={r} />
                  </Link>
                </div>
              ))}
            </FilterSection>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-4">
          {/* Modern Results Header */}
          <div className="mb-6 rounded-xl bg-base-300 p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium text-primary">
                  {countProducts} {countProducts === 1 ? 'Result' : 'Results'}
                  {q !== 'all' && q !== '' && ` for "${q}"`}
                  {category !== 'all' && ` in ${category}`}
                  {price !== 'all' && ` • Price ${price}`}
                  {rating !== 'all' && ` • ${rating} stars & up`}
                </span>
                {(q !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all') && (
                  <Link
                    href="/search"
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex gap-1">
                  {SORT_ORDERS.map((s) => (
                    <Link
                      key={s}
                      href={getFilterUrl({ s })}
                      className={`rounded-full px-3 py-1 text-xs capitalize ${sort === s
                        ? 'bg-yellow-500 text-black'
                        : 'bg-base-100 text-primary hover:bg-base-200'
                        }`}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductItem key={product.slug} product={product} />
                ))}
              </div>

              {/* Modern Pagination */}
              {pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-1">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={getFilterUrl({ pg: `${pageNum}` })}
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${Number(page) === pageNum
                          ? 'bg-base-100 text-white'
                          : 'bg-yellow-500 text-black hover:bg-base-200'
                          }`}
                      >
                        {pageNum}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl bg-base-100 p-8 text-center shadow-sm">
              <h3 className="text-lg font-medium text-primary">No products found</h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your search or filter criteria
              </p>
              <Link
                href="/search"
                className="mt-4 inline-block rounded-box bg-yellow-600 px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-yellow-500"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// FilterSection with modern styling
function FilterSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

// FilterLink with modern styling
function FilterLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <li>
      <Link
        className={`block rounded-box px-3 py-2 text-sm ${active
          ? 'bg-base-100 font-medium text-primary'
          : 'text-primary hover:bg-base-200'
          }`}
        href={href}
      >
        {label}
      </Link>
    </li>
  );
}