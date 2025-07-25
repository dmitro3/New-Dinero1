import React from 'react';
const PaginationDots = ({ selectedIndex, slideCount, onDotClick }) =>
    (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: slideCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-2 w-2 rounded-full ${
            index === selectedIndex ? 'bg-white' : 'bg-slate-300 opacity-70'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
  export default PaginationDots;
  