import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Package } from 'lucide-react';
import { orderAPI, pizzaAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchPizzas();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const response = await pizzaAPI.getAllPizzas();
      setPizzas(response.data);
    } catch (error) {
      toast.error('Failed to load pizzas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeletePizza = async (pizzaId) => {
    if (window.confirm('Are you sure you want to delete this pizza?')) {
      try {
        await pizzaAPI.deletePizza(pizzaId);
        toast.success('Pizza deleted!');
        fetchPizzas();
      } catch (error) {
        toast.error('Failed to delete pizza');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage orders and menu items</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex space-x-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Orders Management
          </button>
          <button
            onClick={() => setActiveTab('pizzas')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'pizzas'
                ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Menu Management
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
          </div>
        ) : (
          <>
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1 min-w-[300px]">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-800">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1 mb-3">
                            <p>
                              <span className="font-semibold">Customer:</span> {order.user?.name}
                            </p>
                            <p>
                              <span className="font-semibold">Email:</span> {order.user?.email}
                            </p>
                            <p>
                              <span className="font-semibold">Address:</span>{' '}
                              {order.deliveryAddress.street}, {order.deliveryAddress.city}
                            </p>
                            <p>
                              <span className="font-semibold">Phone:</span>{' '}
                              {order.deliveryAddress.phone}
                            </p>
                          </div>

                          <div className="text-sm space-y-1">
                            {order.items.map((item, index) => (
                              <p key={index} className="text-gray-600">
                                • {item.pizza.name} ({item.size}) × {item.quantity} - ₹
                                {item.price * item.quantity}
                              </p>
                            ))}
                          </div>

                          <p className="text-lg font-bold text-red-600 mt-3">
                            Total: ₹{order.totalAmount}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Update Status:
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pizzas Tab */}
            {activeTab === 'pizzas' && (
              <div>
                <div className="flex justify-end mb-6">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                    <Plus className="w-5 h-5" />
                    <span>Add New Pizza</span>
                  </button>
                </div>

                {pizzas.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-xl text-gray-600">No pizzas in menu</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pizzas.map((pizza) => (
                      <div
                        key={pizza._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                      >
                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {pizza.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {pizza.description}
                          </p>
                          <div className="flex justify-between items-center text-sm mb-4">
                            <span className="text-gray-600">
                              Small: ₹{pizza.price.small}
                            </span>
                            <span className="text-gray-600">
                              Medium: ₹{pizza.price.medium}
                            </span>
                            <span className="text-gray-600">
                              Large: ₹{pizza.price.large}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeletePizza(pizza._id)}
                              className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;