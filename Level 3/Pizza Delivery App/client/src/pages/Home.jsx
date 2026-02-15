import { useState, useEffect } from 'react';
import { Search, Filter, Flame } from 'lucide-react';
import PizzaCard from '../components/PizzaCard';
import { pizzaAPI } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [vegFilter, setVegFilter] = useState('all');

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await pizzaAPI.getAllPizzas();
      setPizzas(response.data);
    } catch (error) {
      toast.error('Failed to load pizzas');
    } finally {
      setLoading(false);
    }
  };

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pizza.category === categoryFilter;
    const matchesVeg = vegFilter === 'all' || 
                       (vegFilter === 'veg' && pizza.isVeg) || 
                       (vegFilter === 'non-veg' && !pizza.isVeg);
    return matchesSearch && matchesCategory && matchesVeg;
  });

  const categories = ['all', ...new Set(pizzas.map((p) => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading delicious pizzas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-4 animate-bounce">
            🍕 Craving Pizza? We Got You! 🍕
          </h1>
          <p className="text-xl opacity-90">
            Hot, Fresh & Delivered to Your Doorstep in 30 Minutes or Less!
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for your favorite pizza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filters:</span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    categoryFilter === category
                      ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Veg/Non-Veg Filter */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  vegFilter === 'all'
                    ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  vegFilter === 'veg'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌱 Veg
              </button>
              <button
                onClick={() => setVegFilter('non-veg')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  vegFilter === 'non-veg'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pizza Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredPizzas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-600 font-semibold">
              No pizzas found 😢
            </p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;