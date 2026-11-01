import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: 'Americano', category: 'Coffee', price: 110, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80', description: 'Rich espresso with hot water.' },
  { id: 2, name: 'Blueberry Muffin', category: 'Bakery', price: 150, image: 'https://images.unsplash.com/photo-1607958996339-417ef2924df9?auto=format&fit=crop&w=500&q=80', description: 'Freshly baked muffin loaded with blueberries.' },
  { id: 3, name: 'Cafe Frappe', category: 'Coffee', price: 130, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80', description: 'Blended iced coffee topped with foam.' },
  { id: 4, name: 'Cafe Latte', category: 'Coffee', price: 150, image: 'https://images.unsplash.com/photo-1561882468-9110e5c16b31?auto=format&fit=crop&w=500&q=80', description: 'Smooth espresso with steamed milk.' },
  { id: 5, name: 'Cafe Mocha', category: 'Coffee', price: 160, image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=500&q=80', description: 'Espresso combined with chocolate and steamed milk.' },
  { id: 6, name: 'Cappuccino', category: 'Coffee', price: 120, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80', description: 'Classic espresso with equal parts foam and steamed milk.' },
  { id: 7, name: 'Caramel Latte', category: 'Coffee', price: 160, image: 'https://images.unsplash.com/photo-1595928640744-e8696727233d?auto=format&fit=crop&w=500&q=80', description: 'Sweet caramel flavor blended with rich espresso.' },
  { id: 8, name: 'Cheese Sandwich', category: 'Food', price: 100, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80', description: 'Grilled sandwich stuffed with melted cheese.' },
  { id: 9, name: 'Chocolate Brownie', category: 'Bakery', price: 120, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80', description: 'Fudgy and rich chocolate brownie.' },
  { id: 10, name: 'Chocolate Cake', category: 'Bakery', price: 140, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', description: 'Decadent slice of layered chocolate cake.' },
  { id: 11, name: 'Cold Coffee', category: 'Beverages', price: 130, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80', description: 'Chilled blended coffee with creamy texture.' },
  { id: 12, name: 'Croissant', category: 'Bakery', price: 110, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80', description: 'Flaky, buttery French pastry.' },
  { id: 13, name: 'Donut', category: 'Bakery', price: 90, image: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=500&q=80', description: 'Glazed sweet ring donut.' },
  { id: 14, name: 'Espresso', category: 'Coffee', price: 90, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80', description: 'Strong and bold shot of pure espresso.' },
  { id: 15, name: 'French Fries', category: 'Food', price: 90, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80', description: 'Crispy salted potato fries.' },
  { id: 16, name: 'Garlic Bread', category: 'Food', price: 120, image: 'https://images.unsplash.com/photo-1619531003075-17a3556d1f59?auto=format&fit=crop&w=500&q=80', description: 'Toasted bread with garlic butter and herbs.' },
  { id: 17, name: 'Green Tea', category: 'Beverages', price: 80, image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=500&q=80', description: 'Healthy and soothing green tea.' },
  { id: 18, name: 'Hot Chocolate', category: 'Beverages', price: 140, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=500&q=80', description: 'Warm comforting cocoa with rich milk.' },
  { id: 19, name: 'Lemonade', category: 'Beverages', price: 90, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80', description: 'Refreshing zesty lemon cooler.' },
  { id: 20, name: 'Margherita Pizza', category: 'Food', price: 220, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80', description: 'Classic cheesy pizza with fresh basil.' },
  { id: 21, name: 'Masala Chai', category: 'Beverages', price: 60, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80', description: 'Traditional Indian spiced tea.' },
  { id: 22, name: 'Paneer Wrap', category: 'Food', price: 150, image: 'https://images.unsplash.com/photo-1526318896980-cf7b908a1e2a?auto=format&fit=crop&w=500&q=80', description: 'Spiced paneer chunks wrapped in a soft tortilla.' },
  { id: 23, name: 'Veg Burger', category: 'Food', price: 130, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', description: 'Crunchy veggie patty burger with lettuce and mayo.' },
  { id: 24, name: 'Veg Momos', category: 'Food', price: 110, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80', description: 'Steamed dumplings stuffed with seasoned vegetables.' }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});