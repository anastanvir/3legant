'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form';

import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { ShippingAddress } from '@/lib/models/OrderModel';

const Form = () => {
  const router = useRouter();
  const { saveShippingAddress, shippingAddress } = useCartService();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form);
    router.push('/payment');
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
    maxLength,
    minLength,
  }: {
    id: keyof ShippingAddress;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
    maxLength?: ValidationRule<number>;
    minLength?: ValidationRule<number>;
  }) => (
    <div className='mb-4'>
      <label className='label' htmlFor={id}>
        <span className='label-text font-medium'>{name}</span>
      </label>
      <input
        type='text'
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
          maxLength,
          minLength,
        })}
        className={`input input-bordered w-full ${errors[id] ? 'input-error' : ''}`}
      />
      {errors[id]?.message && (
        <div className='mt-1 text-sm text-error'>{errors[id]?.message}</div>
      )}
    </div>
  );

  return (
    <div className='container mx-auto px-4 py-6 '>
      <CheckoutSteps current={1} />
      
      <div className='mx-auto max-w-md'>
        <div className='card bg-base-300 mt-10 shadow-lg'>
          <div className='card-body p-6 sm:p-8'>
            <h1 className='card-title text-2xl mb-6'>Shipping Address</h1>
            <form onSubmit={handleSubmit(formSubmit)}>
              <FormInput 
                name='Full Name' 
                id='fullName' 
                required 
                minLength={{ value: 3, message: 'Name must be at least 3 characters' }}
                maxLength={{ value: 50, message: 'Name cannot exceed 50 characters' }}
              />
              
              <FormInput 
                name='Address' 
                id='address' 
                required 
                minLength={{ value: 5, message: 'Address must be at least 5 characters' }}
              />
              
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <FormInput 
                    name='City' 
                    id='city' 
                    required 
                    pattern={{
                      value: /^[a-zA-Z\s]*$/,
                      message: 'City must contain only letters'
                    }}
                  />
                </div>
                <div>
                  <FormInput 
                    name='Postal Code' 
                    id='postalCode' 
                    required 
                    pattern={{
                      value: /^[0-9]{5}(?:-[0-9]{4})?$/,
                      message: 'Invalid postal code format'
                    }}
                  />
                </div>
              </div>
              
              <FormInput 
                name='Country' 
                id='country' 
                required 
                pattern={{
                  value: /^[a-zA-Z\s]*$/,
                  message: 'Country must contain only letters'
                }}
              />
              
              <div className='mt-6'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn btn-primary w-full'
                >
                  {isSubmitting && <span className='loading loading-spinner' />}
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;