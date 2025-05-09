const Overlay = ({ category }: { category: string }) => {
  return (
    <div className='absolute inset-0 flex items-center justify-center md:bg-base-100/0 transition-all duration-300 md:group-hover: bg-black/40'>
      <span className='translate-y-8 md:text-6xl text-4xl font-semibold md:opacity-0 transition-all duration-300 group-hover:translate-y-0 md:group-hover:opacity-100 opacity-100 uppercase'>
        {category}
      </span>
    </div>
  );
};

export default Overlay;
