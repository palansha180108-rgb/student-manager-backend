'use client';

import { useState } from 'react';

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [menuItems] = useState([
    { id: 1, name: 'Americano', category: 'Coffee', price: 110, status: 'Available', waitTime: '5 mins', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop' },
    { id: 2, name: 'Filter Coffee', category: 'Coffee', price: 80, status: 'Available', waitTime: '5 mins', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop' },
    { id: 3, name: 'Cafe Frappe', category: 'Coffee', price: 180, status: 'Available', waitTime: '8 mins', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop' },
    { id: 4, name: 'Iced Americano', category: 'Coffee', price: 140, status: 'Available', waitTime: '5 mins', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop' },
    { id: 5, name: 'Vanilla Latte', category: 'Coffee', price: 180, status: 'Available', waitTime: '8 mins', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&auto=format&fit=crop' },
    { id: 6, name: 'Caramel Latte', category: 'Coffee', price: 190, status: 'Available', waitTime: '8 mins', image: 'https://images.unsplash.com/photo-1599398054066-846f28917f38?w=300&auto=format&fit=crop' },
    { id: 7, name: 'Hot Chocolate', category: 'Beverages and Tea', price: 160, status: 'Available', waitTime: '6 mins', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&auto=format&fit=crop' },
    { id: 8, name: 'Masala Tea', category: 'Beverages and Tea', price: 60, status: 'Available', waitTime: '4 mins', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop' },
    { id: 9, name: 'Green Tea', category: 'Beverages and Tea', price: 70, status: 'Available', waitTime: '4 mins', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=300&auto=format&fit=crop' },
    { id: 10, name: 'Lemon Iced Tea', category: 'Beverages and Tea', price: 120, status: 'Available', waitTime: '5 mins', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&auto=format&fit=crop' },
    { id: 11, name: 'Chocolate Muffin', category: 'Bakery', price: 90, status: 'Low Stock', waitTime: '2 mins', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&auto=format&fit=crop' },
    { id: 12, name: 'Blueberry Muffin', category: 'Bakery', price: 110, status: 'Available', waitTime: '2 mins', image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&auto=format&fit=crop' },
    { id: 13, name: 'Chocolate Brownie', category: 'Bakery', price: 120, status: 'Available', waitTime: '3 mins', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop' },
    { id: 14, name: 'Chocolate Cake', category: 'Bakery', price: 150, status: 'Available', waitTime: '3 mins', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop' },
    { id: 15, name: 'Veg Burger', category: 'Food', price: 160, status: 'Available', waitTime: '12 mins', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop' },
    { id: 16, name: 'Cheese Sandwich', category: 'Food', price: 170, status: 'Available', waitTime: '10 mins', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop' },
    { id: 17, name: 'Garlic Bread', category: 'Food', price: 130, status: 'Available', waitTime: '8 mins', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Garlic_bread_01.jpg/640px-Garlic_bread_01.jpg' },
    { id: 18, name: 'French Fries', category: 'Food', price: 100, status: 'Available', waitTime: '7 mins', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop' },
  ]);

  const categories = ['All', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredMenu = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ color: '#4a154b', marginBottom: '20px' }}>Campus Cafe Menu</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
        <input 
          type="text" 
          placeholder="Search menu items..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', maxWidth: '400px' }}
        />

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: selectedCategory === cat ? '#4a154b' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#475569',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredMenu.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h4>
                  <span style={{ fontWeight: 'bold', color: '#4a154b' }}>₹{item.price}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>{item.category}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>⏱️ {item.waitTime}</span>
                  <strong style={{ color: item.status === 'Available' ? '#16a34a' : '#d97706' }}>{item.status}</strong>
                </div>
              </div>
            </div>
            <div style={{ padding: '0 15px 15px 15px' }}>
              <button
                onClick={() => alert(`${item.name} added!`)}
                style={{ width: '100%', backgroundColor: '#4a154b', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}