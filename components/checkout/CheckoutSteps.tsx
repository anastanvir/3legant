const CheckoutSteps = ({ current = 0 }) => {
  const steps = ['User Login', 'Shipping Address', 'Payment Method', 'Place Order'];

  return (
    <div className="w-full px-4">
      {/* Mobile - Vertical Steps */}
      <div className="lg:hidden">
        <ul className="steps steps-vertical w-full">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`step ${index <= current ? 'step-primary' : ''}`}
              data-content={index < current ? '✓' : index === current ? '●' : ''}
            >
              <div className="text-left">
                <span className={`font-medium ${index <= current ? 'text-primary' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop - Horizontal Steps */}
      <div className="hidden lg:block">
        <ul className="steps w-full">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`step ${index <= current ? 'step-primary' : ''}`}
              data-content={index < current ? '✓' : ''}
            >
              <span className={`font-medium ${index <= current ? 'text-primary' : 'text-gray-500'}`}>
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CheckoutSteps;