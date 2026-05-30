const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error(`MongoDB Seeder Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleCategories = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Gadgets, phones, laptops and smart accessories.' },
  { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Trendy clothes, shoes, bags and accessories.' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Beautiful decor, furniture and kitchen appliances.' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Gear, sportswear, fitness trackers and outdoor survival.' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Bestselling fiction, learning resources, and biographies.' }
];

const sampleProducts = [
  // Electronics
  {
    name: 'ShopSphere Noise-Cancelling Headphones',
    description: 'Immersive sound experience with up to 40 hours of battery life and adaptive hybrid noise-cancelling technology.',
    price: 199.99,
    category: 'Electronics',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 12
  },
  {
    name: 'ShopSphere Smartwatch Pro',
    description: 'Track your health metrics, receive messages, and navigate with absolute ease with a sleek HSL-colored AMOLED touch display.',
    price: 129.99,
    category: 'Electronics',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    rating: 4.5,
    numReviews: 8
  },
  // Fashion
  {
    name: 'Premium Leather Jacket',
    description: 'Handcrafted from 100% genuine top-grain leather. A timeless classic fit with durable metallic zippers.',
    price: 249.99,
    category: 'Fashion',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    rating: 4.9,
    numReviews: 15
  },
  {
    name: 'Minimalist Canvas Sneakers',
    description: 'Breathable canvas and orthotic support inserts make these the perfect everyday urban walk shoes.',
    price: 59.99,
    category: 'Fashion',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    isFeatured: false,
    rating: 4.2,
    numReviews: 24
  },
  // Home
  {
    name: 'Modernist Ceramic Vase Set',
    description: 'A collection of three matte-finished ceramic vases in sleek pastel color palettes. Perfect for minimalist shelves.',
    price: 45.00,
    category: 'Home & Kitchen',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    rating: 4.6,
    numReviews: 9
  },
  {
    name: 'Sleek Drip Coffee Maker',
    description: 'Precision brewing with temperature controls. Programmatic timer makes sure your morning coffee is ready exactly when you wake up.',
    price: 89.99,
    category: 'Home & Kitchen',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=800&auto=format&fit=crop&q=80',
    isFeatured: false,
    rating: 4.4,
    numReviews: 11
  },
  // Sports
  {
    name: 'Ergonomic Mountain Bike Helmet',
    description: 'Lightweight impact-resistant outer shell with adjustable sizing and standard multi-directional protection system.',
    price: 79.99,
    category: 'Sports & Outdoors',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1582249842910-17945d7c8cc0?w=800&auto=format&fit=crop&q=80',
    isFeatured: false,
    rating: 4.7,
    numReviews: 5
  },
  {
    name: 'Ultra-Grip Yoga Mat',
    description: 'Eco-friendly TPE material with non-slip dual textured surfaces, 6mm thickness offers maximum joint protection.',
    price: 34.99,
    category: 'Sports & Outdoors',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    rating: 4.3,
    numReviews: 32
  },
  // Books
  {
    name: 'The Art of E-Commerce Strategy',
    description: 'A complete handbook on setting up digital enterprises, scaling web applications, and customer lifecycle retention.',
    price: 24.99,
    category: 'Books',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    rating: 5.0,
    numReviews: 7
  },
  {
    name: 'ThunderX Pro Remote Control Car',
    description: 'Experience high-speed excitement with the ThunderX Pro Remote Control Car. Designed for both beginners and RC enthusiasts, this powerful off-road vehicle features a durable shockproof body, high-traction rubber tires, and a precision 2.4GHz remote control system for smooth handling. Reach speeds of up to 40 km/h and conquer grass, sand, gravel, and rough terrain with ease. Equipped with a long-lasting rechargeable battery, LED headlights, and advanced suspension technology, the ThunderX Pro delivers thrilling performance indoors and outdoors. Perfect for kids, teens, and hobbyists seeking endless racing adventures.',
    price: 199.99,
    category: 'Electronics',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    rating: 4.0,
    numReviews: 0
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Database cleared.');

    // Seed Categories
    await Category.insertMany(sampleCategories);
    console.log('Categories seeded.');

    // Create Test Admin and Customer
    const adminUser = new User({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    const customerUser = new User({
      name: 'John Doe',
      email: 'customer@shopsphere.com',
      password: 'customer123',
      role: 'customer',
      isVerified: true,
      addresses: [{
        street: '123 E-Commerce Way',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94107',
        country: 'United States',
        isDefault: true
      }]
    });

    const savedAdmin = await adminUser.save();
    await customerUser.save();
    console.log('Default accounts created (admin@shopsphere.com / customer@shopsphere.com).');

    // Seed Products
    const productsWithReviews = sampleProducts.map(product => ({
      ...product,
      reviews: [
        {
          user: savedAdmin._id,
          name: savedAdmin.name,
          rating: product.rating,
          comment: `Absolutely loved this product. Solid design, and very fast shipping.`
        }
      ]
    }));

    await Product.insertMany(productsWithReviews);
    console.log('Products seeded.');

    console.log('Database Seeding Successful!');
    process.exit();
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
