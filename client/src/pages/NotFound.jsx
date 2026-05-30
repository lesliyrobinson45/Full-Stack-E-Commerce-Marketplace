import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MoveLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="p-5 bg-primary/10 text-primary rounded-full animate-bounce">
        <Compass size={64} />
      </div>
      
      <h1 className="text-8xl font-black text-slate-900 dark:text-white mt-6">404</h1>
      
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2">
        Page Not Found
      </h2>
      
      <p className="text-slate-400 max-w-md mt-4 text-sm leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:scale-105"
        >
          <MoveLeft size={16} />
          <span>Back to Home</span>
        </Link>
        
        <Link
          to="/products"
          className="flex items-center justify-center px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-sm rounded-xl transition-all"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
export { NotFound };
