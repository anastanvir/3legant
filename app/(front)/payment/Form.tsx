'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { FaPaypal, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';

const Form = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { savePaymentMethod, paymentMethod, shippingAddress } = useCartService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return alert('Please select a payment method');
    }
    savePaymentMethod(selectedPaymentMethod);
    router.push('/place-order');
  };

  useEffect(() => {
    if (!shippingAddress) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress]);

  const paymentMethods = [
    {
      id: 'PayPal',
      name: 'PayPal',
      icon: <FaPaypal className="text-blue-500 text-xl" />,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'Stripe',
      name: 'Credit Card',
      icon: <FaCreditCard className="text-purple-500 text-xl" />,
      description: 'Pay with credit or debit card'
    },
    {
      id: 'CashOnDelivery',
      name: 'Cash on Delivery',
      icon: <FaMoneyBillWave className="text-green-500 text-xl" />,
      description: 'Pay when you receive your order'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <CheckoutSteps current={2} />

      <div className="mx-auto max-w-md">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6 sm:p-8">
            <h1 className="card-title text-2xl mb-6">Payment Method</h1>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border-2 rounded-box p-4 cursor-pointer transition-colors ${selectedPaymentMethod === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-base-300 hover:border-primary/50'
                      }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{method.name}</h3>
                          <input
                            type="radio"
                            name="paymentMethod"
                            className="radio radio-primary"
                            checked={selectedPaymentMethod === method.id}
                            onChange={() => setSelectedPaymentMethod(method.id)}
                          />
                        </div>
                        <p className="text-sm text-base-content/70 mt-1">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={!selectedPaymentMethod}
                >
                  Continue to Order Review
                </button>

                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => router.push('/shipping')}
                >
                  Back to Shipping
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