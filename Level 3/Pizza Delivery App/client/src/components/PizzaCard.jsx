import { useState } from 'react';
import { Plus, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PizzaCard = ({ pizza }) => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(pizza, selectedSize);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-red-100 to-yellow-100 overflow-hidden">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover"
        />
        {pizza.isVeg ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            🌱 VEG
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center space-x-1">
            <Flame className="w-3 h-3" />
            <span>NON-VEG</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pizza.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pizza.description}
        </p>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
            {pizza.category}
          </span>
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Select Size:
          </label>
          <div className="flex space-x-2">
            {Object.keys(pizza.price).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  selectedSize === size
                    ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-red-600">
              ₹{pizza.price[selectedSize]}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;