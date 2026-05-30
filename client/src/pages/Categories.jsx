import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Laptop, Shirt, Home, Trophy, BookOpen } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      count: '12+ Products',
      icon: <Laptop size={32} />,
      bgGradient: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: 'Find top-of-the-line wireless headphones, smartwatches, and work-from-home gadgets.'
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      count: '40+ Products',
      icon: <Shirt size={32} />,
      bgGradient: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80',
      description: 'Explore trendy genuine leather wear, shoes, canvas sneakers, and luxury items.'
    },
    {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      count: '18+ Products',
      icon: <Home size={32} />,
      bgGradient: 'from-amber-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      description: 'Discover minimalist ceramic pastel vase sets, precision drip coffee makers, and decor.'
    },
    {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      count: '15+ Products',
      icon: <Trophy size={32} />,
      bgGradient: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80',
      description: 'Premium impact-resistant helmets, fitness yoga mats, and survival camping equipment.'
    },
    {
      name: 'Books',
      slug: 'books',
      count: '25+ Products',
      icon: <BookOpen size={32} />,
      bgGradient: 'from-rose-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
      description: 'Shop digital business models, coding instructionals, fiction novels, and biographies.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Compass className="text-primary animate-pulse" size={28} />
          <span>Product Categories</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Browse through our collections to find premium items for your lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/products?category=${cat.name}`}
            className="group flex flex-col sm:flex-row rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Section */}
            <div className="relative sm:w-1/3 aspect-square sm:aspect-auto min-h-[160px] bg-slate-100 dark:bg-slate-800">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/60 to-transparent"></div>
              
              {/* Dynamic Icon Badge */}
              <div className={`absolute top-4 left-4 p-2.5 rounded-2xl bg-gradient-to-br ${cat.bgGradient} text-white shadow-md shadow-slate-900/10`}>
                {cat.icon}
              </div>
            </div>

            {/* Text description */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-extrabold text-slate-850 dark:text-white group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {cat.count}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="text-xs font-semibold text-primary group-hover:text-primary-dark flex items-center gap-1 mt-6">
                <span>Browse Products</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
export { Categories };
