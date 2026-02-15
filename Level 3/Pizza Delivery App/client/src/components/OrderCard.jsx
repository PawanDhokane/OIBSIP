import { Clock, CheckCircle, Truck, XCircle, Package } from 'lucide-react';

const OrderCard = ({ order }) => {
  const getStatusIcon = () => {
    switch (order.status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'preparing':
        return <Package className="w-5 h-5" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'preparing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Order ID</p>
            <p className="font-bold text-lg">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="font-semibold capitalize">
              {order.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 space-y-4">
        {/* Items */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-700">
                  {item.pizza.name} ({item.size}) × {item.quantity}
                </span>
                <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Delivery Address:</h4>
          <p className="text-sm text-gray-600">
            {order.deliveryAddress.street}, {order.deliveryAddress.city}
          </p>
          <p className="text-sm text-gray-600">
            {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
          </p>
          <p className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</p>
        </div>

        {/* Total & Date */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {formatDate(order.createdAt)}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-red-600">₹{order.totalAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;