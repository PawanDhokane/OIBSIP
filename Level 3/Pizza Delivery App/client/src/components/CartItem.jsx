import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.pizza._id, item.size, item.quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(item.pizza._id, item.size, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.pizza._id, item.size);
  };

  const itemTotal = item.pizza.price[item.size] * item.quantity;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-red-100 to-yellow-100 flex-shrink-0">
        <img
          src={item.pizza.image}
          alt={item.pizza.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800">{item.pizza.name}</h3>
        <p className="text-sm text-gray-600">
          Size: <span className="font-semibold capitalize">{item.size}</span>
        </p>
        <p className="text-lg font-bold text-red-600 mt-1">
          ₹{item.pizza.price[item.size]} × {item.quantity} = ₹{itemTotal}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;