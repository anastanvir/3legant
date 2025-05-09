'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';

import useCartService from '@/lib/hooks/useCartStore';
import { OrderItem } from '@/lib/models/OrderModel';

const AddToCart = ({ item }: { item: OrderItem }) => {
  const router = useRouter();
  const { items, increase, decrease } = useCartService();
  const [existItem, setExistItem] = useState<OrderItem | undefined>();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setExistItem(items.find((x) => x.slug === item.slug));
  }, [item, items]);

  const addToCartHandler = async () => {
    setIsAdding(true);
    try {
      await increase(item);
      // Optional: Show a quick confirmation
      setTimeout(() => setIsAdding(false), 1000);
    } catch (err) {
      setIsAdding(false);
    }
  };

  const increaseHandler = async () => {
    if (!existItem) return;
    setIsAdding(true);
    try {
      await increase(existItem);
      setIsAdding(false);
    } catch (err) {
      setIsAdding(false);
    }
  };

  const decreaseHandler = async () => {
    if (!existItem) return;
    setIsAdding(true);
    try {
      await decrease(existItem);
      setIsAdding(false);
    } catch (err) {
      setIsAdding(false);
    }
  };

  return existItem ? (
    <div className="flex items-center justify-between w-full">
      <button
        className="btn btn-square btn-sm md:btn-md btn-ghost"
        type="button"
        onClick={decreaseHandler}
        disabled={isAdding || existItem.qty <= 1}
        aria-label="Decrease quantity"
      >
        <FiMinus className="text-lg" />
      </button>
      <span className="px-2 font-medium text-center min-w-[2rem]">
        {isAdding ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          existItem.qty
        )}
      </span>
      <button
        className="btn btn-square btn-sm md:btn-md btn-ghost"
        type="button"
        onClick={increaseHandler}
        disabled={isAdding}
        aria-label="Increase quantity"
      >
        <FiPlus className="text-lg" />
      </button>
    </div>
  ) : (
    <button
      className={`btn btn-primary w-full ${isAdding ? 'btn-disabled' : ''}`}
      type="button"
      onClick={addToCartHandler}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Adding...
        </>
      ) : (
        <>
          <FiShoppingCart className="mr-2" />
          Add to Cart
        </>
      )}
    </button>
  );
};

export default AddToCart;