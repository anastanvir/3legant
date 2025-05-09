'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ValidationRule, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { Product } from '@/lib/models/ProductModel';
import { formatId } from '@/lib/utils';

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error } = useSWR(`/api/admin/products/${productId}`);
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }) => {
      addDebugLog(`Starting product update with data: ${JSON.stringify(arg)}`);
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(arg),
        });

        const data = await res.json();
        addDebugLog(`API response: ${res.status} - ${JSON.stringify(data)}`);

        if (!res.ok) {
          throw new Error(data.message || 'Update failed');
        }

        toast.success('Product updated successfully');
        return data;
      } catch (error) {
        addDebugLog(`Update error: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Product>();

  useEffect(() => {
    if (!product) return;
    addDebugLog(`Initializing form with product data: ${JSON.stringify(product)}`);

    setValue('name', product.name);
    setValue('slug', product.slug);
    setValue('price', product.price);
    setValue('category', product.category);
    setValue('brand', product.brand);
    setValue('countInStock', product.countInStock);
    setValue('description', product.description);

    const initialImages = product.images || (product.image ? [product.image] : []);
    setUploadedImages(initialImages);
    addDebugLog(`Initialized with images: ${initialImages.join(', ')}`);
  }, [product, setValue]);

  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsUploading(true);
    const toastId = toast.loading('Uploading images...');
    addDebugLog(`Starting upload of ${e.target.files.length} files`);

    try {
      const files = Array.from(e.target.files);
      const newImageUrls: string[] = [];

      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!resSign.ok) {
        throw new Error('Failed to get Cloudinary signature');
      }
      const { signature, timestamp } = await resSign.json();
      addDebugLog('Received Cloudinary signature');

      for (const [index, file] of files.entries()) {
        try {
          addDebugLog(`Uploading file ${index + 1}/${files.length}: ${file.name}`);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('signature', signature);
          formData.append('timestamp', timestamp);
          formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            { method: 'POST', body: formData }
          );

          const text = await res.text();
          if (!text) {
            throw new Error('Empty response from Cloudinary');
          }

          const data = JSON.parse(text);
          if (!res.ok || !data.secure_url) {
            throw new Error(data.error?.message || 'Upload failed');
          }

          newImageUrls.push(data.secure_url);
          addDebugLog(`File ${index + 1} uploaded: ${data.secure_url}`);
        } catch (fileError) {
          const message = fileError instanceof Error ? fileError.message : 'File upload failed';
          addDebugLog(`File ${index + 1} error: ${message}`);
        }
      }

      if (newImageUrls.length === 0) {
        throw new Error('No files were successfully uploaded');
      }

      setUploadedImages((prev) => [...prev, ...newImageUrls]);
      toast.success(`Uploaded ${newImageUrls.length}/${files.length} files`, {
        id: toastId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      addDebugLog(`Upload error: ${message}`);
      toast.error(message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      addDebugLog(`Removed image at index ${index}. Remaining images: ${updated.length}`);
      return updated;
    });
  };

  const formSubmit = async (formData: any) => {
    addDebugLog('Form submission started');
    try {
      if (uploadedImages.length === 0) {
        throw new Error('Please upload at least one image');
      }

      await updateProduct({
        ...formData,
        images: uploadedImages,
      });
      addDebugLog('Form submission completed successfully');
    } catch (error) {
      addDebugLog(
        `Form submission error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof Product;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className="mb-4 md:flex md:items-center">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
      <div className="w-full md:w-4/5">
        <input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className="input input-bordered w-full"
        />
        {errors[id]?.message && (
          <div className="text-error text-sm mt-1">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  );

  if (error)
    return (
      <div className="alert alert-error m-4">
        <span>{error.message}</span>
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );

  return (
    <div className="p-4  max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">Edit Product {formatId(productId)}</h1>
        <Link href="/admin/products" className="btn btn-ghost">
          Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
        <FormInput name="Name" id="name" required />
        <FormInput name="Slug" id="slug" required />

        {/* Image Upload Section */}
        <div className="mb-4 md:flex md:items-start">
          <label className="label md:w-1/5">Images</label>
          <div className="w-full md:w-4/5 space-y-2">
            <input
              multiple
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/*"
              onChange={uploadHandler}
              disabled={isUploading}
            />
            <div className="grid grid-cols-2  md:grid-cols-4 gap-4 mt-2">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative aspect-square my-4">
                  <img
                    src={img}
                    alt={`Product preview ${index}`}
                    className="h-full w-full rounded-box  object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn btn-circle btn-error btn-sm absolute -right-2 -top-2 opacity-90"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {uploadedImages.length === 0 && (
              <div className="text-warning text-sm">At least one image is required</div>
            )}
          </div>
        </div>

        <FormInput name="Price" id="price" required />
        <FormInput name="Category" id="category" required />
        <FormInput name="Brand" id="brand" required />
        <FormInput name="Description" id="description" required />
        <FormInput name="Count In Stock" id="countInStock" required />

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:ml-[20%] md:pl-4">
          <button
            type="submit"
            disabled={isUpdating || isUploading}
            className="btn btn-primary flex-1"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Update Product
          </button>
          <Link href="/admin/products" className="btn btn-outline flex-1">
            Cancel
          </Link>
        </div>
      </form>

      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 rounded-lg bg-base-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Debug Logs</h3>
            <button onClick={() => setDebugLogs([])} className="btn btn-xs btn-ghost">
              Clear
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto text-xs">
            {debugLogs.length === 0 ? (
              <div className="text-gray-500">No logs yet</div>
            ) : (
              debugLogs.map((log, i) => (
                <div key={i} className="border-b border-base-300 py-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}