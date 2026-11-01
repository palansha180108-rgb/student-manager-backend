'use client';

import { useEffect, useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCartCount(prev => prev + 1);
    alert(`${item.name} cart me add ho gaya hai!`);
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>Loading menu items...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Campus Cafe Menu</h1>
        <div style={{ backgroundColor: '#16a34a', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
          🛒 Cart Items: {cartCount}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {menuItems.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', textAlign: 'center', backgroundColor: '#fff' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
            <h3 style={{ marginTop: '10px', fontSize: '18px', fontWeight: '600' }}>{item.name}</h3>
            <p style={{ color: '#666', fontSize: '12px', margin: '4px 0' }}>{item.category}</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2e7d32' }}>₹{item.price}</p>
            <button
              onClick={() => addToCart(item)}
              style={{ marginTop: '15px', backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}