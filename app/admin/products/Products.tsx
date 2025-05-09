'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';

export default function Products() {
  const { data: products, error, isLoading } = useSWR(`/api/admin/products`);
  const router = useRouter();

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...');
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success('Product deleted successfully', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          });
    },
  );

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('Product created successfully');
      router.push(`/admin/products/${data.product._id}`);
    },
  );

  if (error)
    return (
      <div className='alert alert-error'>
        <span>Error loading products: {error.message}</span>
      </div>
    );

  if (isLoading || !products)
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='loading loading-spinner loading-lg'></div>
      </div>
    );

  return (
    <div className='p-4'>
      <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-2xl font-bold'>Products</h1>
        <button
          disabled={isCreating}
          onClick={() => createProduct()}
          className='btn btn-primary btn-sm sm:btn-md'
        >
          {isCreating ? (
            <span className='loading loading-spinner'></span>
          ) : (
            'Create New'
          )}
        </button>
      </div>

      {/* Desktop Table */}
      <div className='hidden overflow-x-auto rounded-lg border border-base-300 md:block'>
        <table className='table w-full'>
          <thead className='bg-base-200'>
            <tr>
              <th className='px-4 py-3'>ID</th>
              <th className='px-4 py-3'>Name</th>
              <th className='px-4 py-3 text-right'>Price</th>
              <th className='px-4 py-3'>Category</th>
              <th className='px-4 py-3 text-right'>Stock</th>
              <th className='px-4 py-3 text-right'>Rating</th>
              <th className='px-4 py-3 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product._id} className='hover:bg-base-200'>
                <td className='px-4 py-3 font-mono'>{formatId(product._id!)}</td>
                <td className='px-4 py-3 font-medium'>{product.name}</td>
                <td className='px-4 py-3 text-right'>${product.price.toFixed(2)}</td>
                <td className='px-4 py-3'>
                  <span className='badge badge-outline'>{product.category}</span>
                </td>
                <td className='px-4 py-3 text-right'>
                  <span className={`badge ${product.countInStock > 0 ? 'badge-success' : 'badge-error'}`}>
                    {product.countInStock}
                  </span>
                </td>
                <td className='px-4 py-3 text-right'>
                  <span className='badge badge-info'>{product.rating}</span>
                </td>
                <td className='px-4 py-3 text-right'>
                  <div className='flex justify-end space-x-2'>
                    <Link
                      href={`/admin/products/${product._id}`}
                      className='btn btn-outline btn-sm btn-primary'
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct({ productId: product._id! })}
                      className='btn btn-outline btn-sm btn-error'
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='space-y-4 md:hidden'>
        {products.map((product: Product) => (
          <div key={product._id} className='card border border-base-300 bg-base-100 shadow'>
            <div className='card-body p-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='font-semibold'>ID:</div>
                <div className='font-mono text-right'>{formatId(product._id!)}</div>
                
                <div className='font-semibold'>Name:</div>
                <div className='text-right font-medium'>{product.name}</div>
                
                <div className='font-semibold'>Price:</div>
                <div className='text-right'>${product.price.toFixed(2)}</div>
                
                <div className='font-semibold'>Category:</div>
                <div className='text-right'>
                  <span className='badge badge-outline'>{product.category}</span>
                </div>
                
                <div className='font-semibold'>Stock:</div>
                <div className='text-right'>
                  <span className={`badge ${product.countInStock > 0 ? 'badge-success' : 'badge-error'}`}>
                    {product.countInStock}
                  </span>
                </div>
                
                <div className='font-semibold'>Rating:</div>
                <div className='text-right'>
                  <span className='badge badge-info'>{product.rating}</span>
                </div>
              </div>
              
              <div className='card-actions mt-4 grid grid-cols-2 gap-2'>
                <Link
                  href={`/admin/products/${product._id}`}
                  className='btn btn-primary btn-sm'
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct({ productId: product._id! })}
                  className='btn btn-error btn-sm'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}